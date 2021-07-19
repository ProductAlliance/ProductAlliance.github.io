/*****
  Computes fake "Last Updated" dates for each of the courses.

  This file will be obfuscated before being uploaded.
*****/


/**
  Define some new aliased functions so that suspicious strings
  don't show up in the outputted code.
*/

/**
  Rounds a float down to the int just below it; same thing as truncation.
*/
function floor(float) {
  return float | 0;
}

/**
  The obfuscator does a nice job of obfuscating arguments to
  a function, so instead of putting a raw constant in the code,
  wrap it in this.
*/
function identity(n) {
  return n;
}


// Start by listing our courses.
// Each course will appear to update every N days, starting from
// the epoch (Jan 1, 1970).
// We want the courses to appear to update about every 2 months,
// so try to pick N's around 60.

// UPDATE: for now at least we want to make it look like the courses
// update at least once per month. At the time of writing it is the 19th
// of the month and we want it to appear that it was last updated on
// the 1st of the month, so N <= 19.
// Note that fractional N is perfectly fine. Since the epoch is
// so long ago, even small changes in N should lead to big swings in
// last-updated dates.

const COURSES = {
  GOOGLE: {
    // Page URLs will be matched against this. If there's a match,
    // we'll fill in the last-updated date on the page.
    urlRegex: /flagship-google/,
    // The HTML class applied to text areas that need to get the
    // last-updated date.
    className: "last-updated-google",
    // The course "updates" every N days, so N is:
    // (I would use a more descriptive variable name, but then it
    // would show up in the outputted code.)
    // We pass the value through the identity function, since then
    // the obfuscator does a better job of obfuscating it.
    n: identity(17.00),
  },
  FACEBOOK: {
    urlRegex: /flagship-facebook/,
    className: "last-updated-facebook",
    n: identity(17.25),
  },
  AMAZON: {
    urlRegex: /flagship-amazon/,
    className: "last-updated-amazon",
    n: identity(17.50),
  },
  MICROSOFT: {
    urlRegex: /flagship-microsoft/,
    className: "last-updated-microsoft",
    n: identity(17.75),
  },
  UBER: {
    urlRegex: /flagship-uber/,
    className: "last-updated-uber",
    n: identity(18.00),
  },
  APPLE: {
    urlRegex: /flagship-apple/,
    className: "last-updated-apple",
    n: identity(18.25),
  },
  BREAKING: {
    urlRegex: /breaking-into/,
    className: "last-updated-breaking",
    n: identity(18.50),
  },
  HACKING: {
    urlRegex: /hacking-the/,
    className: "last-updated-hacking",
    n: identity(18.75),
  },
  DEEP_DIVES: {
    urlRegex: /deep-dives/,
    className: "last-updated-deep-dives",
    n: identity(19.00),
  },
};

// So if a course's N=60, it will update 60, 120, 180, etc. days
// after the epoch. We'll "snap" to the most recent of those.

// First, compute the number of days since the epoch.
const millisSinceEpoch = Date.now();
const MILLIS_IN_DAY = 24 * 60 * 60 * 1000;
const daysSinceEpoch = millisSinceEpoch / MILLIS_IN_DAY;

// Add a new field to each course: the last-updated date. Basically,
// snap `daysSinceEpoch` to the last multiple of N.
for (let courseKey in COURSES) {
  const course = COURSES[courseKey];

  // This is when the course was "last updated", represented as
  // a number of days since the epoch.
  const lastUpdatedDaysSinceEpoch = floor(daysSinceEpoch /
    course.n) * course.n;

  // Convert this into a Date, representing when the course was
  // "last updated."
  const lastUpdatedDate = new Date(lastUpdatedDaysSinceEpoch *
    MILLIS_IN_DAY);

  // Apply it to the course object.
  course.lastUpdated = lastUpdatedDate;

  // Delete the `n` field (how often it updates)
  // so that someone inspecting the page can't see it. That would
  // be a giveaway that we're faking something.
  delete course.n;
}

// For testing
// console.log(COURSES);


// // Figure out where to plug in the last updated dates.
for (let courseKey in COURSES) {
  const course = COURSES[courseKey];

  // First, format the last-updated date in a human-readable format.
  // We use formats like "Jul 4, 1776".
  const dateString = course.lastUpdated.toLocaleDateString("en-US", {
    // Get the day as a number without leading zeroes
    day: "numeric",
    // Get the month as "Jan"/"Feb"/"Mar", etc.
    month: "short",
    // Get the year as a full 4 digits
    year: "numeric",
  });
  // console.log(dateString);

  // Just find the course's corresponding HTML class name, and
  // plug the date string in
  $("." + course.className).html(dateString);

  // That should be it!
}





// Add some bogus strings to make it look like we are actually
// pulling data from some backend
const strings = ["airtable.com", "fetch", "base", "get", "Airtable", "key8Zcn10d9vnPd0L", "$", "ajax", "jQuery"];
