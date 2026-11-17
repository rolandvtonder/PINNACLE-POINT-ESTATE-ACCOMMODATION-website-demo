<?php
/**
 * Free dates for the website's calendar, read from the lodge's Airbnb calendar.
 *
 * Airbnb publishes each listing's calendar as an iCal (.ics) link:
 * Airbnb → Listing → Availability → Connect calendars → Export calendar.
 * Paste that link below. The site's calendar asks this file for the booked
 * nights and shows everything else as free. Runs on Afrihost's standard
 * Linux (PHP) hosting; nothing else needs installing.
 *
 * The link is fixed here (never taken from the request), and the answer is
 * cached for 30 minutes so Airbnb is asked at most twice an hour.
 */

// TODO: paste the Airbnb "Export calendar" link between the quotes.
const ICAL_URL = '';
const CACHE_SECONDS = 1800;

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: public, max-age=300');

function reply(array $data, int $status = 200): void {
    http_response_code($status);
    echo json_encode($data);
    exit;
}

if (ICAL_URL === '') {
    reply(['connected' => false, 'booked' => []]);
}

$cache = sys_get_temp_dir() . '/pinnacle-availability.json';
if (is_file($cache) && time() - filemtime($cache) < CACHE_SECONDS) {
    readfile($cache);
    exit;
}

$ctx = stream_context_create(['http' => ['timeout' => 8, 'user_agent' => 'PinnaclePointCalendar/1.0']]);
$ics = @file_get_contents(ICAL_URL, false, $ctx);
if ($ics === false) {
    // Airbnb unreachable: serve the last good copy if there is one.
    if (is_file($cache)) {
        readfile($cache);
        exit;
    }
    reply(['connected' => false, 'booked' => [], 'error' => 'calendar unavailable'], 502);
}

// Unfold folded lines (RFC 5545), then read each event's start and end date.
$ics = preg_replace("/\r?\n[ \t]/", '', $ics);
$booked = [];
foreach (explode('BEGIN:VEVENT', $ics) as $i => $event) {
    if ($i === 0) continue;
    if (!preg_match('/^DTSTART[^:]*:(\d{8})/m', $event, $s)) continue;
    if (!preg_match('/^DTEND[^:]*:(\d{8})/m', $event, $e)) continue;
    $fmt = fn($d) => substr($d, 0, 4) . '-' . substr($d, 4, 2) . '-' . substr($d, 6, 2);
    // `end` is the check-out day: that night is free again.
    $booked[] = ['start' => $fmt($s[1]), 'end' => $fmt($e[1])];
}

$json = json_encode(['connected' => true, 'updated' => gmdate('c'), 'booked' => $booked]);
@file_put_contents($cache, $json, LOCK_EX);
echo $json;
