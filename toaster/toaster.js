$(function(){

  // Create absolutely-positioned element to store toasts
  let toastHolderHTML = `
    <!-- Position it -->
    <div id="toast-wrapper"
      style="position: fixed; bottom: 0; left: 0; margin: 1em;"
      class="d-none d-md-block"
      >

      <!-- Then put toasts within -->
      <div id="toast-holder">

      </div>
    </div>
  `;
  $(toastHolderHTML).appendTo("body");

  // This lets us wait X milliseconds synchronously
  // From https://stackoverflow.com/a/47480429
  const delay = ms => new Promise(res => setTimeout(res, ms));

  // This will be set to false once we've matched, and that
  // will let us break out
  let hasMatched = false;

  // Read FOMO config to figure out what to do
  FOMO_CONFIG.forEach((configObject) => {
    // See if it matches the URL
    if (!hasMatched &&
        window.location.href.search(configObject.pageRegex) > -1) {
      // Loop through the toasts
      configObject.toasts.forEach(async (toastInfo) => {
        // Wait until we're ready
        await delay(toastInfo.time / 1);

        // Now create and show
        createAndShowToast({
          messageHTML: toastInfo.text,
          ctaText: toastInfo.ctaText,
          ctaURL: toastInfo.ctaURL,
          icon: toastInfo.icon,
          duration: toastInfo.duration,
        });
      });

      // We will only match one, so let's drop out
      // (this lets us have a "fallback" default)
      // console.log(configObject.pageRegex);
      hasMatched = true;
    }
  });
});



// Icon SVG shorthands; drop into HTML
const ICONS = {
  "book": `<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-book" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
  <path fill-rule="evenodd" d="M1 2.828v9.923c.918-.35 2.107-.692 3.287-.81 1.094-.111 2.278-.039 3.213.492V2.687c-.654-.689-1.782-.886-3.112-.752-1.234.124-2.503.523-3.388.893zm7.5-.141v9.746c.935-.53 2.12-.603 3.213-.493 1.18.12 2.37.461 3.287.811V2.828c-.885-.37-2.154-.769-3.388-.893-1.33-.134-2.458.063-3.112.752zM8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783z"/>
</svg>`,
  "book_half": `<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-book-half" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
  <path fill-rule="evenodd" d="M8.5 2.687v9.746c.935-.53 2.12-.603 3.213-.493 1.18.12 2.37.461 3.287.811V2.828c-.885-.37-2.154-.769-3.388-.893-1.33-.134-2.458.063-3.112.752zM8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783z"/>
</svg>`,
  "video": `<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-file-play-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
  <path fill-rule="evenodd" d="M12 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zM6 5.883v4.234a.5.5 0 0 0 .757.429l3.528-2.117a.5.5 0 0 0 0-.858L6.757 5.454a.5.5 0 0 0-.757.43z"/>
</svg>`,
  "bullseye": `<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-bullseye" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
  <path fill-rule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
  <path fill-rule="evenodd" d="M8 13A5 5 0 1 0 8 3a5 5 0 0 0 0 10zm0 1A6 6 0 1 0 8 2a6 6 0 0 0 0 12z"/>
  <path fill-rule="evenodd" d="M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/>
  <path d="M9.5 8a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
</svg>`,
  "cart": `<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-cart-check-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
  <path fill-rule="evenodd" d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1H.5zM4 14a1 1 0 1 1 2 0 1 1 0 0 1-2 0zm7 0a1 1 0 1 1 2 0 1 1 0 0 1-2 0zm.354-7.646a.5.5 0 0 0-.708-.708L8 8.293 6.854 7.146a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0l3-3z"/>
</svg>`,
  "briefcase": `<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-briefcase-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
  <path fill-rule="evenodd" d="M0 12.5A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5V6.85L8.129 8.947a.5.5 0 0 1-.258 0L0 6.85v5.65z"/>
  <path fill-rule="evenodd" d="M0 4.5A1.5 1.5 0 0 1 1.5 3h13A1.5 1.5 0 0 1 16 4.5v1.384l-7.614 2.03a1.5 1.5 0 0 1-.772 0L0 5.884V4.5zm5-2A1.5 1.5 0 0 1 6.5 1h3A1.5 1.5 0 0 1 11 2.5V3h-1v-.5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5V3H5v-.5z"/>
</svg>`,
  "verified": `<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-patch-check-fll" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" d="M10.067.87a2.89 2.89 0 0 0-4.134 0l-.622.638-.89-.011a2.89 2.89 0 0 0-2.924 2.924l.01.89-.636.622a2.89 2.89 0 0 0 0 4.134l.637.622-.011.89a2.89 2.89 0 0 0 2.924 2.924l.89-.01.622.636a2.89 2.89 0 0 0 4.134 0l.622-.637.89.011a2.89 2.89 0 0 0 2.924-2.924l-.01-.89.636-.622a2.89 2.89 0 0 0 0-4.134l-.637-.622.011-.89a2.89 2.89 0 0 0-2.924-2.924l-.89.01-.622-.636zm.287 5.984a.5.5 0 0 0-.708-.708L7 8.793 5.854 7.646a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0l3-3z"/>
                </svg>`,
  "check_circle": `<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-check-circle-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
  <path fill-rule="evenodd" d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
</svg>`,
  "reels": `<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-camera-reels-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
  <path fill-rule="evenodd" d="M0 8a2 2 0 0 1 2-2h7.5a2 2 0 0 1 1.983 1.738l3.11-1.382A1 1 0 0 1 16 7.269v7.462a1 1 0 0 1-1.406.913l-3.111-1.382A2 2 0 0 1 9.5 16H2a2 2 0 0 1-2-2V8z"/>
  <circle cx="3" cy="3" r="3"/>
  <circle cx="9" cy="3" r="3"/>
</svg>`,
  "play": `<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-play-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
  <path d="M11.596 8.697l-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/>
</svg>`,
};




// Creates a toast, puts it on the page, and immediately shows it.
// Pass HTML to put inside as the main message.
// Pass parameters:
// - messageHTML
// - ctaText
// - ctaURL
// - icon
// - duration
function createAndShowToast(options) {
  // Unbundle options
  let {messageHTML, ctaText, ctaURL, icon, duration} = options;

  // Generate a unique ID
  let toastID = "toast-" + Date.now();

  // Generate the CTA code. Only show it if ctaURL was given
  let ctaHTML = "";
  if (ctaURL) {
    ctaHTML = `
      <a href="${ctaURL}" data-dismiss="toast">
        ${ctaText}
      </a>`;
  }

  // Generate toast HTML
  let toastHTML = `
  <div class="toast bg-light" id="${toastID}">
      <!--<div class="toast-header">
        <strong class="mr-auto text-primary">Product Alliance</strong>
        <small>
          <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-patch-check-fll" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" d="M10.067.87a2.89 2.89 0 0 0-4.134 0l-.622.638-.89-.011a2.89 2.89 0 0 0-2.924 2.924l.01.89-.636.622a2.89 2.89 0 0 0 0 4.134l.637.622-.011.89a2.89 2.89 0 0 0 2.924 2.924l.89-.01.622.636a2.89 2.89 0 0 0 4.134 0l.622-.637.89.011a2.89 2.89 0 0 0 2.924-2.924l-.01-.89.636-.622a2.89 2.89 0 0 0 0-4.134l-.637-.622.011-.89a2.89 2.89 0 0 0-2.924-2.924l-.89.01-.622-.636zm.287 5.984a.5.5 0 0 0-.708-.708L7 8.793 5.854 7.646a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0l3-3z"/>
          </svg>
          Verified
        </small>
        <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>-->
      <div class="toast-body">
        <div class="row">
          <div class="col-sm-4 row align-items-center">
            <div class="pulsar mx-auto row align-items-center" data-dismiss="toast">
              <div class="h2 text-white mx-auto">${icon}</div>
            </div>
          </div>
          <div class="col-sm-8">
            ${messageHTML}
            ${ctaHTML}

            <br>

            <span class="small text-success">
              ${ICONS.check_circle}
              Verified
            </span>
            &middot;
            <span class="small text-muted">
              <span data-dismiss="toast" class="clickable">
                Dismiss
              </span>
            </span>

          </div>
        </div>
      </div>
    </div>
  </div>
  `;

  // Create element
  $(toastHTML).appendTo($("#toast-holder"));

  // Build the toast. Give it a timeout if one was provided, else
  // make it last forever.
  let toastOptions = duration ? { delay: duration } : { autohide: false };
  $('#' + toastID).toast(toastOptions);

  // Set up click handlers on the pulsing bubble to go to the CTA.
  // That lets people get to the endpoint more easily without screwing up
  // formatting by adding an <a> tag
  if (ctaURL) {
    $('#' + toastID).find(".pulsar")
      .addClass("clickable")
      .on("click", () => {
        window.location.href = ctaURL;
      });
  }

  // Now show it
  $('#' + toastID).toast('show');
}

// Configuration for where/how to show the toasts.
const FOMO_CONFIG = [
  // For the interview strategy guide pages
  {
    "pageRegex": "/guides/facebook-pm",
    "toasts": makeGuideToasts(g_analytics.facebook_pm_viewers, "Facebook", "PM")
  },
  {
    "pageRegex": "/guides/facebook-rpm",
    "toasts": makeGuideToasts(g_analytics.facebook_rpm_viewers, "Facebook", "RPM")
  },
  {
    "pageRegex": "/guides/google-pm",
    "toasts": makeGuideToasts(g_analytics.google_pm_viewers, "Google", "PM")
  },
  {
    "pageRegex": "/guides/google-apm",
    "toasts": makeGuideToasts(g_analytics.google_apm_viewers, "Google", "APM")
  },
  {
    "pageRegex": "/guides/amazon-pm",
    "toasts": makeGuideToasts(g_analytics.amazon_pm_viewers, "Amazon", "PM")
  },
  {
    "pageRegex": "/guides/microsoft-pm",
    "toasts": makeGuideToasts(g_analytics.microsoft_pm_viewers, "Microsoft", "PM")
  },

  // For video pages
  {
    "pageRegex": "/videos/snapchat",
    "toasts": makeVideoToasts(g_analytics.watched_snapchat_video, "Snapchat")
  },
  {
    "pageRegex": "/videos/airbnb",
    "toasts": makeVideoToasts(g_analytics.watched_airbnb_video, "Airbnb")
  },
  {
    "pageRegex": "/videos/apple",
    "toasts": makeVideoToasts(g_analytics.watched_apple_video, "Apple")
  },
  {
    "pageRegex": "/videos/uber",
    "toasts": makeVideoToasts(g_analytics.watched_uber_video, "Uber")
  },

  // Job/internship lists
  {
    "pageRegex": "/job-list",
    "toasts": makeJobInternToasts(g_analytics.used_job_list, "job")
  },
  {
    "pageRegex": "/internship-list",
    "toasts": makeJobInternToasts(g_analytics.used_internship_list, "internship")
  },

  // If we're already on the pricing page, don't get in the way!
  {
    "pageRegex": "pricing",
    "toasts": []
  },
  // Similarly, if you're at the footer (result of a CTA to sign up for the webinar),
  // don't upsell anything
  {
    "pageRegex": "footer",
    "toasts": []
  },

  // Fall back to show some generic toasts on all other pages
  {
    "pageRegex": ".*",
    "toasts": [
      makeWatchedWebinarToast(15000),
      makeBoughtCourseToast(45000)
    ]
  },
];

// Convenience functions to generate config blobs.

// This is for /guides/ pages
function makeGuideToasts(viewNumber, company, role){
  return [
    {
      "time": 15000,
      "text": `<strong>${viewNumber} ${company} ${role} candidates</strong>
        read this cheat sheet in the last 48 hours.`,
      "icon": ICONS.book_half,
      "duration": 30000,
    },
    makeWatchedWebinarToast(),
    makeBoughtCourseToast()
  ];
}

// This is for /videos/ pages
function makeVideoToasts(viewNumber, caseStudy){
  return [
    {
      "time": 15000,
      "text": `<strong>${viewNumber} PM candidates</strong>
        watched this ${caseStudy} strategy video in the last 48 hours.`,
      "icon": ICONS.play,
      "duration": 30000,
    },
    makeWatchedWebinarToast(),
    makeBoughtCourseToast()
  ];
}

// This is for the job or internship list
function makeJobInternToasts(viewNumber, type){
  return [
    {
      "time": 15000,
      "text": `<strong>${viewNumber} PM candidates</strong>
        used this list to apply for PM ${type}s in the last 48 hours.`,
      "icon": ICONS.briefcase,
      "duration": 30000,
    },
    makeWatchedWebinarToast(),
    makeBoughtCourseToast()
  ];
}



// Small utility chunks
function makeWatchedWebinarToast(time=25000){
  return {
    "time": time,
    "text": `<strong>${g_analytics.watched_webinar} candidates</strong>
      watched our free 42-minute PM interview lesson in the last 48 hours.`,
    "ctaText": "Sign up for free!",
    "ctaURL": "#footer",
    "icon": ICONS.video,
  };
}

function makeBoughtCourseToast(time=55000) {
  return {
    "time": time,
    "text": `<strong>${g_analytics.bought_course} candidates bought</strong>
      lifetime access to our 3-course PM bundle in the last 48 hours.`,
    "ctaText": "Get 55% off!",
    "ctaURL": "https://productalliance.com/#pricing",
    "icon": ICONS.cart,
  };
}
