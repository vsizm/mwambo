"use client";

import { useEffect, useState } from "react";

const CONSENT_COOKIE = "mwambo_cookie_consent";

export default function CookieConsent(){
  const [visible,setVisible]=useState(false);
  useEffect(()=>{
    const hasConsent=document.cookie.split("; ").some(x=>x.startsWith(CONSENT_COOKIE+"="));
    if(!hasConsent) setVisible(true);
  },[]);
  const accept=()=>{
    document.cookie=CONSENT_COOKIE+"=accepted; Max-Age=31536000; Path=/; SameSite=Lax";
    setVisible(false);
  };
  if(!visible) return null;
  return <aside className="cookie-banner" role="dialog" aria-label="Cookie notice">
    <div><strong>Cookies &amp; privacy</strong><p>Mwambo uses a small number of essential cookies to remember your privacy choice and keep the site working. We do not currently use advertising or analytics cookies.</p><div className="cookie-links"><a href="/cookie-policy">Cookie Policy</a><a href="/privacy-policy">Privacy Policy</a><a href="/data-protection">Data Protection</a></div></div>
    <button type="button" onClick={accept}>Accept</button>
  </aside>;
}
