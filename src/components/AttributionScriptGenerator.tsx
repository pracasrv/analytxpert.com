import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, CheckCircle2, BarChart3 } from "lucide-react";

// Available parameters to track
const AVAILABLE_PARAMS = [
  { id: 'utm_source', label: 'UTM Source', description: 'Traffic source (e.g., google, facebook)', default: true },
  { id: 'utm_medium', label: 'UTM Medium', description: 'Marketing medium (e.g., cpc, email)', default: true },
  { id: 'utm_campaign', label: 'UTM Campaign', description: 'Campaign name', default: true },
  { id: 'utm_term', label: 'UTM Term', description: 'Paid search keywords', default: true },
  { id: 'utm_content', label: 'UTM Content', description: 'Ad creative/variation', default: true },
  { id: 'utm_id', label: 'UTM ID', description: 'Campaign ID', default: false },
  { id: 'gclid', label: 'Google Click ID', description: 'Google Ads click identifier', default: true },
  { id: 'fbclid', label: 'Facebook Click ID', description: 'Facebook Ads click identifier', default: true },
  { id: 'ttclid', label: 'TikTok Click ID', description: 'TikTok Ads click identifier', default: true },
  { id: 'gbraid', label: 'Google GBRAID', description: 'Google Ads iOS tracking', default: true },
  { id: 'wbraid', label: 'Google WBRAID', description: 'Google Ads web-to-app', default: true },
  { id: 'msclkid', label: 'Microsoft Click ID', description: 'Microsoft Ads click identifier', default: true },
  { id: 'ref', label: 'Referral Code', description: 'Referral/affiliate parameter', default: false },
  { id: 'affiliate_id', label: 'Affiliate ID', description: 'Affiliate partner identifier', default: false },
];

const AttributionScriptGenerator = () => {
  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [storeUrl, setStoreUrl] = useState("");
  const [firstTouchParams, setFirstTouchParams] = useState<string[]>(
    AVAILABLE_PARAMS.filter(p => p.default).map(p => p.id)
  );
  const [lastTouchParams, setLastTouchParams] = useState<string[]>(
    AVAILABLE_PARAMS.filter(p => p.default).map(p => p.id)
  );
  const [cookieExpiry, setCookieExpiry] = useState("30");
  const [submitted, setSubmitted] = useState(false);
  const [toastMsg, setToastMsg] = useState<{ text: string; type: 'success' | 'error' | 'warning' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' | 'warning' = 'success') => {
    setToastMsg({ text, type });
    setTimeout(() => setToastMsg(null), 4000);
  };

  // Handle parameter selection
  const toggleFirstTouch = (paramId: string) => {
    setFirstTouchParams(prev =>
      prev.includes(paramId)
        ? prev.filter(p => p !== paramId)
        : [...prev, paramId]
    );
  };

  const toggleLastTouch = (paramId: string) => {
    setLastTouchParams(prev =>
      prev.includes(paramId)
        ? prev.filter(p => p !== paramId)
        : [...prev, paramId]
    );
  };

  // Generate the customized script
  const generateScript = () => {
    const firstTouchArray = firstTouchParams.map(p => `    '${p}'`).join(',\n');
    const lastTouchArray = lastTouchParams.map(p => `    '${p}'`).join(',\n');

    return `/**
 * Shopify UTM & Click ID Attribution Tracker
 *
 * Generated for: ${name}
 * Store: ${storeUrl}
 * Generated: ${new Date().toISOString().split('T')[0]}
 *
 * Installation: Add this script to your theme.liquid file before the closing </body> tag
 */

(function () {
  'use strict';

  // ============================================================================
  // CONFIGURATION - CUSTOMIZE THESE PARAMETERS
  // ============================================================================

  /**
   * FIRST TOUCH PARAMETERS
   * Captured on the user's FIRST visit and stored permanently (${cookieExpiry} days)
   */
  var FIRST_TOUCH_PARAMS = [
${firstTouchArray}
  ];

  /**
   * LAST TOUCH PARAMETERS
   * Captured on EVERY visit and updated with latest values
   */
  var LAST_TOUCH_PARAMS = [
${lastTouchArray}
  ];

  // ============================================================================
  // ADVANCED SETTINGS
  // ============================================================================

  var CONFIG = {
    cookieExpiry: ${cookieExpiry},
    cookieDomain: window.location.hostname,
    firstTouchPrefix: 'ft_',
    lastTouchPrefix: 'lt_',
    debug: false  // Set to true to see console logs during testing
  };

  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================

  function getUrlParameter(name) {
    var regex = new RegExp('[?&]' + name + '=([^&#]*)');
    var results = regex.exec(window.location.search);
    return results ? decodeURIComponent(results[1].replace(/\\+/g, ' ')) : null;
  }

  function setCookie(name, value, days) {
    var expires = '';
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = '; expires=' + date.toUTCString();
    }
    var domain = CONFIG.cookieDomain ? '; domain=' + CONFIG.cookieDomain : '';
    document.cookie = name + '=' + encodeURIComponent(value) + expires + domain + '; path=/; SameSite=Lax';

    if (CONFIG.debug) {
      console.log('Cookie set:', name, '=', value);
    }
  }

  function getCookie(name) {
    var match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
    return match ? decodeURIComponent(match[1]) : null;
  }

  function getGA4ClientId() {
    var gaCookie = getCookie('_ga');
    if (!gaCookie) return null;

    var parts = gaCookie.split('.');
    if (parts.length >= 4) {
      return parts[2] + '.' + parts[3];
    }
    return gaCookie;
  }

  function getTimestamp() {
    return Math.floor(Date.now() / 1000);
  }

  function isNewSession() {
    var lastVisit = getCookie('_last_visit');
    var now = getTimestamp();

    if (!lastVisit) return true;

    var timeSinceLastVisit = now - parseInt(lastVisit, 10);
    return timeSinceLastVisit > 1800; // 30 minutes
  }

  function updateLastVisit() {
    setCookie('_last_visit', getTimestamp(), 1);
  }

  // ============================================================================
  // ATTRIBUTION CAPTURE
  // ============================================================================

  function captureAttributionData() {
    var isNew = isNewSession();
    var lastTouchParams = {};
    var firstTouchParams = {};
    var hasLastTouchData = false;
    var hasFirstTouchData = false;

    // Capture LAST TOUCH parameters
    LAST_TOUCH_PARAMS.forEach(function(param) {
      var value = getUrlParameter(param);
      if (value) {
        hasLastTouchData = true;
        lastTouchParams[param] = value;
      }
    });

    // Capture FIRST TOUCH parameters
    FIRST_TOUCH_PARAMS.forEach(function(param) {
      var value = getUrlParameter(param);
      if (value) {
        hasFirstTouchData = true;
        firstTouchParams[param] = value;
      }
    });

    if (!hasLastTouchData && !hasFirstTouchData) {
      updateLastVisit();
      return;
    }

    var timestamp = getTimestamp();
    if (hasLastTouchData) {
      lastTouchParams['timestamp'] = timestamp;
    }
    if (hasFirstTouchData) {
      firstTouchParams['timestamp'] = timestamp;
    }

    // Store LAST TOUCH
    if (hasLastTouchData) {
      Object.keys(lastTouchParams).forEach(function(key) {
        setCookie(CONFIG.lastTouchPrefix + key, lastTouchParams[key], CONFIG.cookieExpiry);
      });
      if (CONFIG.debug) {
        console.log('Last touch captured:', lastTouchParams);
      }
    }

    // Store FIRST TOUCH (only if none exists)
    if (hasFirstTouchData) {
      var hasExistingFirstTouch = false;
      for (var i = 0; i < FIRST_TOUCH_PARAMS.length; i++) {
        if (getCookie(CONFIG.firstTouchPrefix + FIRST_TOUCH_PARAMS[i])) {
          hasExistingFirstTouch = true;
          break;
        }
      }

      if (!hasExistingFirstTouch) {
        Object.keys(firstTouchParams).forEach(function(key) {
          setCookie(CONFIG.firstTouchPrefix + key, firstTouchParams[key], CONFIG.cookieExpiry);
        });
        if (CONFIG.debug) {
          console.log('First touch captured:', firstTouchParams);
        }
      }
    }

    updateLastVisit();
  }

  // ============================================================================
  // SHOPIFY CART INTEGRATION
  // ============================================================================

  function collectAttributionForCart() {
    var attributes = {};

    // Collect FIRST TOUCH
    FIRST_TOUCH_PARAMS.forEach(function(param) {
      var value = getCookie(CONFIG.firstTouchPrefix + param);
      if (value) {
        attributes['first_touch_' + param] = value;
      }
    });

    var ftTimestamp = getCookie(CONFIG.firstTouchPrefix + 'timestamp');
    if (ftTimestamp) {
      attributes['first_touch_timestamp'] = ftTimestamp;
    }

    // Collect LAST TOUCH
    LAST_TOUCH_PARAMS.forEach(function(param) {
      var value = getCookie(CONFIG.lastTouchPrefix + param);
      if (value) {
        attributes['last_touch_' + param] = value;
      }
    });

    var ltTimestamp = getCookie(CONFIG.lastTouchPrefix + 'timestamp');
    if (ltTimestamp) {
      attributes['last_touch_timestamp'] = ltTimestamp;
    }

    // Add GA4 Client ID
    var ga4Id = getGA4ClientId();
    if (ga4Id) {
      attributes['ga4_client_id'] = ga4Id;
    }

    return attributes;
  }

  function updateShopifyCart() {
    var attributesToSet = collectAttributionForCart();

    if (Object.keys(attributesToSet).length === 0) {
      if (CONFIG.debug) {
        console.log('No attribution data to update');
      }
      return;
    }

    if (CONFIG.debug) {
      console.log('Updating Shopify cart with:', attributesToSet);
    }

    fetch('/cart.js')
      .then(function(res) {
        if (!res.ok) throw new Error('Failed to fetch cart');
        return res.json();
      })
      .then(function(cart) {
        var currentAttributes = cart.attributes || {};
        var needsUpdate = false;

        for (var key in attributesToSet) {
          if (attributesToSet.hasOwnProperty(key) &&
              currentAttributes[key] !== attributesToSet[key]) {
            needsUpdate = true;
            break;
          }
        }

        if (!needsUpdate) {
          if (CONFIG.debug) {
            console.log('Cart attributes already up to date');
          }
          return;
        }

        var updatedAttributes = Object.assign({}, currentAttributes, attributesToSet);

        return fetch('/cart/update.js', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            attributes: updatedAttributes
          })
        });
      })
      .then(function(res) {
        if (res && res.ok) {
          if (CONFIG.debug) {
            console.log('Cart attributes updated successfully');
          }
        }
      })
      .catch(function(err) {
        if (CONFIG.debug) {
          console.error('Error updating cart attributes:', err);
        }
      });
  }

  // ============================================================================
  // INITIALIZATION
  // ============================================================================

  function init() {
    captureAttributionData();

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', updateShopifyCart);
    } else {
      updateShopifyCart();
    }

    if (CONFIG.debug) {
      console.log('Attribution tracker initialized');
    }
  }

  init();

})();
`;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !storeUrl) {
      showToast("Please fill in all required fields", "error");
      return;
    }

    if (firstTouchParams.length === 0 && lastTouchParams.length === 0) {
      showToast("Please select at least one parameter to track", "error");
      return;
    }

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          access_key: "7019f52d-9fde-4b36-a505-f37e877f8270",
          name: name,
          email: email,
          subject: "New Attribution Script Download - AnalytXpert",
          message: `
NEW ATTRIBUTION SCRIPT DOWNLOAD

Contact Info:
- Name: ${name}
- Email: ${email}
- Store: ${storeUrl}

Configuration:
- First Touch Parameters (${firstTouchParams.length}): ${firstTouchParams.join(', ')}
- Last Touch Parameters (${lastTouchParams.length}): ${lastTouchParams.join(', ')}
- Cookie Expiry: ${cookieExpiry} days

Timestamp: ${new Date().toLocaleString()}

---
This lead came from the Attribution Script Generator tool.
          `.trim(),
          "Store URL": storeUrl,
          "First Touch Params": firstTouchParams.join(', '),
          "Last Touch Params": lastTouchParams.join(', '),
          "Cookie Expiry": `${cookieExpiry} days`,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitted(true);
        showToast("Script customized! Download below.", "success");
      } else {
        setSubmitted(true);
        showToast("Script ready for download", "warning");
      }
    } catch (error) {
      setSubmitted(true);
      showToast("Script ready for download", "warning");
    }
  };

  // Download the script
  const handleDownload = () => {
    const script = generateScript();
    const blob = new Blob([script], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `utm-attribution-tracker-${storeUrl.replace(/[^a-zA-Z0-9]/g, '-')}.js`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast("Script downloaded! Check your Downloads folder.", "success");
  };

  const toastColors = {
    success: 'bg-primary text-primary-foreground',
    error: 'bg-destructive text-destructive-foreground',
    warning: 'bg-yellow-600 text-white',
  };

  return (
    <div className="container max-w-4xl px-6 py-16">
      {/* Toast */}
      {toastMsg && (
        <div className={`fixed top-20 right-4 z-50 px-4 py-3 rounded-md shadow-lg text-sm font-medium transition-all ${toastColors[toastMsg.type]}`}>
          {toastMsg.text}
        </div>
      )}

      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Generate Attribution Memory Script
        </h1>
        <p className="text-xl text-muted-foreground mb-2">
          Takes ~2 minutes. No app installs. No lock-in.
        </p>
      </div>

      {!submitted ? (
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Contact Info */}
          <Card>
            <CardHeader>
              <CardTitle>Your Information</CardTitle>
              <CardDescription>
                We'll customize the script for your store
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@store.com"
                  required
                />
                <p className="text-sm text-muted-foreground mt-1.5">
                  Double-check this — This is where we'll send the script and follow-up resources
                </p>
              </div>
              <div>
                <Label htmlFor="storeUrl">Shopify Store URL *</Label>
                <Input
                  id="storeUrl"
                  value={storeUrl}
                  onChange={(e) => setStoreUrl(e.target.value)}
                  placeholder="mystore.myshopify.com"
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* First Touch Parameters */}
          <Card>
            <CardHeader>
              <CardTitle>First Touch Attribution</CardTitle>
              <CardDescription>
                Captured on the user's FIRST visit (shows what introduced them)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {AVAILABLE_PARAMS.map((param) => (
                <div key={`ft-${param.id}`} className="flex items-start space-x-3">
                  <Checkbox
                    id={`ft-${param.id}`}
                    checked={firstTouchParams.includes(param.id)}
                    onCheckedChange={() => toggleFirstTouch(param.id)}
                  />
                  <div className="flex-1">
                    <Label htmlFor={`ft-${param.id}`} className="font-semibold cursor-pointer">
                      {param.label}
                    </Label>
                    <p className="text-sm text-muted-foreground">{param.description}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Last Touch Parameters */}
          <Card>
            <CardHeader>
              <CardTitle>Last Touch Attribution</CardTitle>
              <CardDescription>
                Captured on EVERY visit (shows what converted them)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {AVAILABLE_PARAMS.map((param) => (
                <div key={`lt-${param.id}`} className="flex items-start space-x-3">
                  <Checkbox
                    id={`lt-${param.id}`}
                    checked={lastTouchParams.includes(param.id)}
                    onCheckedChange={() => toggleLastTouch(param.id)}
                  />
                  <div className="flex-1">
                    <Label htmlFor={`lt-${param.id}`} className="font-semibold cursor-pointer">
                      {param.label}
                    </Label>
                    <p className="text-sm text-muted-foreground">{param.description}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Advanced Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="cookieExpiry">Cookie Expiry (days)</Label>
                <Input
                  id="cookieExpiry"
                  type="number"
                  value={cookieExpiry}
                  onChange={(e) => setCookieExpiry(e.target.value)}
                  min="1"
                  max="365"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  How long to remember attribution data (recommended: 30 days)
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="text-center">
            <Button type="submit" size="lg" className="text-lg px-8 py-6">
              Generate Attribution Memory Script
            </Button>
          </div>
        </form>
      ) : (
        /* Success State */
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <CheckCircle2 className="h-20 w-20 text-primary" />
          </div>
          <h2 className="text-3xl font-bold">Your Script is Ready!</h2>
          <p className="text-lg text-muted-foreground">
            Customized for {name} ({storeUrl})
          </p>

          <div className="bg-secondary/20 rounded-lg p-6 text-left">
            <h3 className="font-bold mb-2">Tracking Configuration:</h3>
            <div className="space-y-2 text-sm">
              <p>
                <strong>First Touch:</strong> {firstTouchParams.length} parameters
              </p>
              <p>
                <strong>Last Touch:</strong> {lastTouchParams.length} parameters
              </p>
              <p>
                <strong>Cookie Expiry:</strong> {cookieExpiry} days
              </p>
            </div>
          </div>

          <Button size="lg" onClick={handleDownload} className="text-lg px-8 py-6">
            <Download className="mr-2 h-5 w-5" />
            Download Script
          </Button>

          <div className="pt-8 border-t">
            <h3 className="text-2xl font-bold mb-6 text-center">Installation Instructions</h3>

            {/* Installation Steps */}
            <div className="mb-8 p-6 bg-muted/30 rounded-lg border border-border max-w-3xl mx-auto text-left">
              <h4 className="text-lg font-semibold text-foreground mb-4">Follow these steps to install:</h4>
              <ol className="space-y-3 text-sm text-muted-foreground mb-6">
                <li className="flex gap-3">
                  <span className="font-semibold text-foreground">1.</span>
                  <span>In Shopify, go to <strong>Online Store &rarr; Themes</strong></span>
                </li>
                <li className="flex gap-3">
                  <span className="font-semibold text-foreground">2.</span>
                  <span>Click the 3 vertical dots next to your current theme and choose <strong>'Edit Code'</strong></span>
                </li>
                <li className="flex gap-3">
                  <span className="font-semibold text-foreground">3.</span>
                  <span>This will open a new tab</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-semibold text-foreground">4.</span>
                  <span>Right-click on the <strong>Assets</strong> folder and choose <strong>'Add a new asset'</strong></span>
                </li>
                <li className="flex gap-3">
                  <span className="font-semibold text-foreground">5.</span>
                  <span>Upload the script file you downloaded</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-semibold text-foreground">6.</span>
                  <span>Click on <strong>Layout</strong> folder &rarr; <strong>theme.liquid</strong> file</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-semibold text-foreground">7.</span>
                  <span>Scroll to find <code className="bg-muted px-1.5 py-0.5 rounded text-xs">&lt;/head&gt;</code></span>
                </li>
                <li className="flex gap-3">
                  <span className="font-semibold text-foreground">8.</span>
                  <span>Create a new line <strong>before</strong> <code className="bg-muted px-1.5 py-0.5 rounded text-xs">&lt;/head&gt;</code></span>
                </li>
                <li className="flex gap-3">
                  <span className="font-semibold text-foreground">9.</span>
                  <span>Paste the code below (replace the filename with your downloaded script name)</span>
                </li>
              </ol>

              <div className="bg-background rounded p-4 font-mono text-sm overflow-x-auto border border-border">
                <code className="text-foreground">
                  {"{{ 'replace-with-the-name-of-your-script-file.js' | asset_url | script_tag }}"}
                </code>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Example: If your file is named <code className="bg-muted px-1 rounded">utm-tracker.js</code>, use <code className="bg-muted px-1 rounded">{"{{ 'utm-tracker.js' | asset_url | script_tag }}"}</code>
              </p>
            </div>

            {/* Video */}
            <div className="max-w-3xl mx-auto mb-8">
              <h4 className="text-lg font-semibold mb-4 text-center">Watch the installation walkthrough:</h4>
              <div className="rounded-lg overflow-hidden border border-border shadow-xl bg-background aspect-video">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/Hiee_KFeajE"
                  title="How to Install Attribution Memory Script"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>

            {/* Testing Steps */}
            <div className="max-w-3xl mx-auto p-6 bg-primary/5 rounded-lg border border-primary/20">
              <h4 className="text-lg font-semibold mb-3">After Installation - Test It:</h4>
              <ol className="space-y-2 text-sm">
                <li>1. Visit your store with UTM parameters: <code className="bg-muted px-1.5 py-0.5 rounded text-xs">?utm_source=test&utm_campaign=test</code></li>
                <li>2. Place a test order</li>
                <li>3. Check the order in Shopify Admin &rarr; look for "Additional details"</li>
                <li>4. You should see your attribution data saved in the order!</li>
              </ol>
            </div>
          </div>

          {/* Google Sheet Analyzer */}
          <div className="pt-8 border-t max-w-3xl mx-auto text-left">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold">Next Step: Analyze Your Attribution Data</h3>
            </div>
            <p className="text-muted-foreground mb-6">
              Once your script is installed and orders start flowing in, use our free
              <strong> Google Sheet Analyzer</strong> to instantly unpack the attribution column
              from your Shopify order export — no formulas, no manual work.
            </p>

            <div className="grid sm:grid-cols-3 gap-4 mb-6">
              {[
                { step: '1', title: 'Export orders from Shopify', desc: 'Orders → Export → CSV' },
                { step: '2', title: 'Import CSV into the Sheet', desc: 'File → Import → your CSV file' },
                { step: '3', title: 'Click "Parse & Build Dashboard"', desc: 'Instant insights appear' },
              ].map(item => (
                <div key={item.step} className="p-4 bg-muted/30 rounded-lg border border-border">
                  <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center mb-2">
                    {item.step}
                  </div>
                  <p className="font-semibold text-sm text-foreground">{item.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="p-5 bg-primary/5 rounded-lg border border-primary/20 mb-6">
              <p className="text-sm font-semibold text-foreground mb-3">The dashboard automatically shows you:</p>
              <div className="grid sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
                {[
                  'Revenue by first touch source, medium & campaign',
                  'Revenue by last touch source & campaign',
                  'Attribution paths (first to last touch)',
                  'Monthly order & revenue trend',
                  'Click ID coverage by platform (Meta, Google, TikTok)',
                  'Attribution quality breakdown',
                  'KPIs: total orders, coverage rate, attributed revenue',
                  'Revenue by payment method',
                ].map(item => (
                  <p key={item}>{item}</p>
                ))}
              </div>
            </div>

            <div className="p-4 bg-muted/40 rounded-lg border border-border text-sm">
              <p className="font-semibold text-foreground mb-2">How to set up the Google Sheet Analyzer:</p>
              <ol className="space-y-2 text-muted-foreground">
                <li className="flex gap-2"><span className="font-semibold text-foreground shrink-0">1.</span><span>Open a new Google Sheet &rarr; <strong>Extensions &rarr; Apps Script</strong></span></li>
                <li className="flex gap-2"><span className="font-semibold text-foreground shrink-0">2.</span><span>Delete the placeholder code, paste the Attribution Analyzer script, click <strong>Save</strong></span></li>
                <li className="flex gap-2"><span className="font-semibold text-foreground shrink-0">3.</span><span>Close the Apps Script tab and <strong>reload</strong> the sheet — a "Attribution" menu appears</span></li>
                <li className="flex gap-2"><span className="font-semibold text-foreground shrink-0">4.</span><span>Click <strong>Attribution &rarr; Setup Sheet</strong> — then follow the in-sheet instructions</span></li>
              </ol>
              <p className="mt-3 text-xs text-muted-foreground/70">
                The script is free, open-source, and runs entirely inside your own Google Sheet. Your data never leaves your account.
              </p>
            </div>
          </div>

          <div className="pt-8 border-t">
            <p className="text-muted-foreground mb-4">
              Need help setting this up or interpreting your attribution data?
            </p>
            <Button
              variant="outline"
              onClick={() => window.open('https://calendly.com/pracasrv/15min', '_blank')}
            >
              Book a Free 15-Minute Call
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttributionScriptGenerator;
