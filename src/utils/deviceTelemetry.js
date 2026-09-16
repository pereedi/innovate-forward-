/**
 * Device & Visitor Telemetry Detection Utility
 * Accurately extracts OS, OS Version, Browser Name, Browser Version,
 * Device Type, Screen Resolution, and public IP Address.
 */

// Cached IP to avoid unnecessary duplicate fetches within the same session
let cachedIpAddress = null;

/**
 * Asynchronously fetch client public IP address with timeout fallback
 */
export async function getClientIpAddress() {
  if (cachedIpAddress) return cachedIpAddress;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const res = await fetch('https://api.ipify.org?format=json', {
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      cachedIpAddress = data.ip || 'Unknown IP';
      return cachedIpAddress;
    }
  } catch (err) {
    // Graceful fallback if offline or blocked by client extension
  }

  // Backup fallback IP lookup
  try {
    const controller2 = new AbortController();
    const timeoutId2 = setTimeout(() => controller2.abort(), 2000);
    const res2 = await fetch('https://api64.ipify.org?format=json', {
      signal: controller2.signal
    });
    clearTimeout(timeoutId2);
    if (res2.ok) {
      const data2 = await res2.json();
      cachedIpAddress = data2.ip || 'Unknown IP';
      return cachedIpAddress;
    }
  } catch (err) {
    // Silent failover
  }

  cachedIpAddress = 'Unavailable';
  return cachedIpAddress;
}

/**
 * Detect Operating System and OS Version
 */
export function detectOperatingSystem() {
  const ua = navigator.userAgent || '';
  let osName = 'Unknown OS';
  let osVersion = '';

  if (/Windows NT 10.0/i.test(ua)) {
    osName = 'Windows';
    osVersion = '10 / 11';
  } else if (/Windows NT 6.3/i.test(ua)) {
    osName = 'Windows';
    osVersion = '8.1';
  } else if (/Windows NT 6.2/i.test(ua)) {
    osName = 'Windows';
    osVersion = '8';
  } else if (/Windows NT 6.1/i.test(ua)) {
    osName = 'Windows';
    osVersion = '7';
  } else if (/Macintosh|Mac OS X/i.test(ua)) {
    osName = 'macOS';
    const match = ua.match(/Mac OS X ([0-9_]+)/i);
    if (match && match[1]) {
      osVersion = match[1].replace(/_/g, '.');
    }
  } else if (/iPhone|iPad|iPod/i.test(ua)) {
    osName = /iPad/i.test(ua) ? 'iPadOS' : 'iOS';
    const match = ua.match(/OS ([0-9_]+)/i);
    if (match && match[1]) {
      osVersion = match[1].replace(/_/g, '.');
    }
  } else if (/Android/i.test(ua)) {
    osName = 'Android';
    const match = ua.match(/Android ([0-9.]+)/i);
    if (match && match[1]) {
      osVersion = match[1];
    }
  } else if (/Linux/i.test(ua)) {
    osName = 'Linux';
    osVersion = '';
  } else if (/CrOS/i.test(ua)) {
    osName = 'ChromeOS';
    osVersion = '';
  }

  return { osName, osVersion };
}

/**
 * Detect Browser Name and Version
 */
export function detectBrowser() {
  const ua = navigator.userAgent || '';
  let browserName = 'Unknown Browser';
  let browserVersion = '';

  if (/Edg\/([0-9.]+)/i.test(ua)) {
    browserName = 'Microsoft Edge';
    browserVersion = ua.match(/Edg\/([0-9.]+)/i)?.[1] || '';
  } else if (/OPR\/([0-9.]+)/i.test(ua) || /Opera/i.test(ua)) {
    browserName = 'Opera';
    browserVersion = ua.match(/(?:OPR|Opera)[/ ]([0-9.]+)/i)?.[1] || '';
  } else if (/Chrome\/([0-9.]+)/i.test(ua)) {
    browserName = 'Google Chrome';
    browserVersion = ua.match(/Chrome\/([0-9.]+)/i)?.[1] || '';
  } else if (/Safari\/([0-9.]+)/i.test(ua) && !/Chrome/i.test(ua)) {
    browserName = 'Apple Safari';
    browserVersion = ua.match(/Version\/([0-9.]+)/i)?.[1] || '';
  } else if (/Firefox\/([0-9.]+)/i.test(ua)) {
    browserName = 'Mozilla Firefox';
    browserVersion = ua.match(/Firefox\/([0-9.]+)/i)?.[1] || '';
  }

  return { browserName, browserVersion };
}

/**
 * Detect Device Type
 */
export function detectDeviceType() {
  const ua = navigator.userAgent || '';
  const isTouch = navigator.maxTouchPoints > 0;
  const width = window.innerWidth;

  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'Tablet';
  }
  if (/Mobile|iPhone|Android.*Mobile|BlackBerry|IEMobile|Opera Mini/i.test(ua)) {
    return 'Mobile';
  }
  if (isTouch && width <= 768) {
    return 'Mobile';
  }
  if (isTouch && width <= 1024) {
    return 'Tablet';
  }
  return 'Desktop';
}

/**
 * Assemble Complete Visitor Telemetry Payload
 */
export async function getFullVisitorTelemetry(section = 'landing_page') {
  const { osName, osVersion } = detectOperatingSystem();
  const { browserName, browserVersion } = detectBrowser();
  const deviceType = detectDeviceType();
  const screenResolution = `${window.screen?.width || window.innerWidth}x${window.screen?.height || window.innerHeight}`;
  const ipAddress = await getClientIpAddress();

  return {
    ip_address: ipAddress,
    os_name: osName,
    os_version: osVersion || 'Latest',
    browser_name: browserName,
    browser_version: browserVersion ? browserVersion.split('.')[0] : '',
    device_type: deviceType,
    screen_resolution: screenResolution,
    user_agent: navigator.userAgent || '',
    section_viewed: section,
    referrer: document.referrer || 'Direct'
  };
}
