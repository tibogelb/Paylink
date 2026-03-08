/* eslint-disable no-restricted-globals */
import { useState, useEffect, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL  = "https://ksmzyhghnnkctvgknlxt.supabase.co";
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtzbXp5aGdobm5rY3R2Z2tubHh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4Mjk5NDYsImV4cCI6MjA4ODQwNTk0Nn0.5Ig6p3vhNJjloHJrIJRJGlTYX3-1EqqsD2_34BQ55Pg";
const ADMIN_PASSWORD = "admin2024";

const sb = createClient(SUPABASE_URL, SUPABASE_ANON);

const T = {
  bg:"#F4F6FA", surface:"#FFFFFF", border:"#E5E9F2", border2:"#D0D7E8",
  nav:"#FFFFFF", text:"#1A1D2E", sub:"#6B7280", muted:"#9CA3AF", input:"#F8F9FC",
};
const CAT_COLORS  = { PRO:"#059669", Joueur:"#EA580C" };
const CAT_COLORS2 = { PRO:"#D1FAE5", Joueur:"#FFEDD5" };
const CAT_ICONS   = { PRO:"💼", Joueur:"🎮" };
const SELLER_COLORS = ["#059669","#EA580C","#7C3AED","#0284C7","#D97706","#DB2777"];

function ttc(ht)  { return Math.round(ht*1.2*100)/100; }

function fmtDate(d) {
  const dt=new Date(d);
  return dt.toLocaleDateString("fr-FR",{day:"2-digit",month:"2-digit",year:"numeric"})
    +" "+dt.toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"});
}
function extractNbGames(label) {
  const m=label.match(/\b(\d+)\s*(ditch|ditchs|jeu|jeux|partie|parties|round|rounds)/i);
  return m?parseInt(m[1]):1;
}
function initials(name) {
  return name.trim().split(/\s+/).map(w=>w[0]).join("").toUpperCase().slice(0,2);
}
function fmtPrice(p) { return Number(p).toFixed(2).replace(".",",")+" €"; }

const inputStyle = {
  width:"100%", boxSizing:"border-box", background:T.input, border:`1px solid ${T.border}`,
  borderRadius:10, padding:"11px 13px", color:T.text, fontSize:14,
  fontFamily:"'Syne',sans-serif", outline:"none",
};
const btnPrimary = {
  background:"linear-gradient(135deg,#059669,#047857)", border:"none", borderRadius:10,
  padding:"12px 20px", color:"#fff", fontWeight:800, fontSize:14,
  cursor:"pointer", fontFamily:"'Syne',sans-serif",
};
const btnGhost = {
  background:"transparent", border:`1px solid ${T.border}`, borderRadius:10,
  padding:"10px 16px", color:T.sub, fontWeight:600, fontSize:13,
  cursor:"pointer", fontFamily:"'Syne',sans-serif",
};

// ── Confirm Modal ─────────────────────────────────────────────────────────────
function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.4)", zIndex:300, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
      <div style={{ background:T.surface, borderRadius:16, padding:28, width:"100%", maxWidth:340, border:`1px solid ${T.border}`, textAlign:"center", boxShadow:"0 20px 60px rgba(0,0,0,0.15)" }}>
        <div style={{ fontSize:32, marginBottom:14 }}>⚠️</div>
        <p style={{ color:T.text, fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:15, marginBottom:22 }}>{message}</p>
        <div style={{ display:"flex", gap:10 }}>
          <button onClick={onCancel}  style={{ flex:1, background:T.bg, border:`1px solid ${T.border}`, borderRadius:9, padding:12, color:T.sub, cursor:"pointer", fontFamily:"'Syne',sans-serif", fontWeight:600 }}>Annuler</button>
          <button onClick={onConfirm} style={{ flex:1, background:"#EF4444", border:"none", borderRadius:9, padding:12, color:"#fff", cursor:"pointer", fontFamily:"'Syne',sans-serif", fontWeight:800 }}>Supprimer</button>
        </div>
      </div>
    </div>
  );
}

// ── Nav bar ───────────────────────────────────────────────────────────────────
function NavBar({ right, center }) {
  return (
    <div style={{ background:"#FFE600", borderBottom:"none", padding:"0 20px", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:50, height:56, boxShadow:"0 2px 8px rgba(0,0,0,0.12)" }}>
      <div style={{ display:"flex", alignItems:"center", gap:9 }}>
        <div style={{ width:28, height:28, borderRadius:8, background:"rgba(0,0,0,0.15)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>⚡</div>
        <span style={{ fontWeight:900, fontSize:16, color:"#1A1D2E", fontFamily:"'Syne',sans-serif" }}>PayLink Ditch!</span>
      </div>
      {center && <div>{center}</div>}
      <div>{right}</div>
    </div>
  );
}

// ── Seller Picker ─────────────────────────────────────────────────────────────
function SellerPicker({ sellers, onSelect }) {
  return (
    <div style={{ minHeight:"100vh", background:T.bg, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:24, fontFamily:"'Syne',sans-serif" }}>
      <div style={{ marginBottom:36, textAlign:"center" }}>
        <div style={{ width:60, height:60, borderRadius:18, background:"#FFE600", display:"flex", alignItems:"center", justifyContent:"center", fontSize:28, margin:"0 auto 16px", boxShadow:"0 8px 24px rgba(255,230,0,0.4)" }}>⚡</div>
        <h1 style={{ color:T.text, fontSize:26, fontWeight:900, margin:"0 0 6px" }}>PayLink Ditch!</h1>
        <p style={{ color:T.sub, fontSize:14 }}>Qui êtes-vous ?</p>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:12, width:"100%", maxWidth:360 }}>
        {sellers.filter(s=>s.active).map((s,i)=>{
          const c=SELLER_COLORS[i%SELLER_COLORS.length];
          return (
            <button key={s.id} onClick={()=>onSelect(s)} style={{ background:T.surface, border:`2px solid ${T.border}`, borderRadius:16, padding:"18px 22px", cursor:"pointer", display:"flex", alignItems:"center", gap:16, outline:"none", width:"100%", fontFamily:"'Syne',sans-serif", transition:"all 0.18s", boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}
              onMouseEnter={e=>{ e.currentTarget.style.borderColor=c; e.currentTarget.style.boxShadow=`0 4px 16px ${c}33`; e.currentTarget.style.transform="translateY(-1px)"; }}
              onMouseLeave={e=>{ e.currentTarget.style.borderColor=T.border; e.currentTarget.style.boxShadow="0 2px 8px rgba(0,0,0,0.06)"; e.currentTarget.style.transform="none"; }}>
              <div style={{ width:46, height:46, borderRadius:13, background:c+"18", border:`2px solid ${c}44`, display:"flex", alignItems:"center", justifyContent:"center", color:c, fontWeight:900, fontSize:16, flexShrink:0 }}>{initials(s.name)}</div>
              <span style={{ color:T.text, fontWeight:800, fontSize:18 }}>{s.name}</span>
              <span style={{ marginLeft:"auto", color:c, fontSize:20 }}>→</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Admin Login ───────────────────────────────────────────────────────────────
function AdminLogin({ onSuccess, onBack }) {
  const [pwd,setPwd]=useState(""), [err,setErr]=useState(false), [shake,setShake]=useState(false);
  function attempt() {
    if (pwd===ADMIN_PASSWORD) onSuccess();
    else { setErr(true); setShake(true); setTimeout(()=>setShake(false),400); setPwd(""); }
  }
  return (
    <div style={{ minHeight:"100vh", background:T.bg, display:"flex", alignItems:"center", justifyContent:"center", padding:24, fontFamily:"'Syne',sans-serif" }}>
      <style>{`@keyframes shake{0%,100%{transform:translateX(0)}25%,75%{transform:translateX(-8px)}50%{transform:translateX(8px)}}`}</style>
      <div style={{ background:T.surface, borderRadius:20, padding:"36px 32px", width:"100%", maxWidth:360, border:`1px solid ${T.border}`, textAlign:"center", boxShadow:"0 8px 32px rgba(0,0,0,0.08)", animation:shake?"shake 0.4s":"none" }}>
        <div style={{ width:52, height:52, borderRadius:14, background:"#D1FAE5", border:"1px solid #6EE7B7", margin:"0 auto 18px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:24 }}>🔐</div>
        <h3 style={{ color:T.text, fontSize:20, fontWeight:800, marginBottom:6 }}>Accès Admin</h3>
        <p style={{ color:T.sub, fontSize:13, marginBottom:22 }}>Saisissez le mot de passe</p>
        <input type="password" placeholder="••••••••" value={pwd}
          onChange={e=>{ setPwd(e.target.value); setErr(false); }} onKeyDown={e=>e.key==="Enter"&&attempt()}
          style={{ ...inputStyle, textAlign:"center", letterSpacing:4, marginBottom:10, border:`1px solid ${err?"#EF4444":T.border}` }}/>
        {err && <div style={{ color:"#EF4444", fontSize:12, marginBottom:10 }}>Mot de passe incorrect</div>}
        <button onClick={attempt} style={{ ...btnPrimary, width:"100%", marginBottom:10 }}>Entrer</button>
        <button onClick={onBack} style={{ background:"none", border:"none", color:T.muted, fontSize:13, cursor:"pointer", fontFamily:"'Syne',sans-serif" }}>← Retour</button>
      </div>
    </div>
  );
}

// ── Admin Sellers ─────────────────────────────────────────────────────────────
function AdminSellers({ sellers, reload }) {
  const [name,setName]=useState(""), [saving,setSaving]=useState(false);
  const [confirmDel,setConfirmDel]=useState(null);

  async function add() {
    if (!name.trim()) return;
    setSaving(true);
    const sort_order = sellers.length;
    await sb.from("sellers").insert({ name:name.trim(), active:true, sort_order });
    setName(""); await reload(); setSaving(false);
  }
  async function toggle(s) {
    await sb.from("sellers").update({ active:!s.active }).eq("id",s.id);
    reload();
  }
  async function doDelete(id) {
    await sb.from("sellers").delete().eq("id",id);
    setConfirmDel(null); reload();
  }

  return (
    <div style={{ padding:"24px 20px", maxWidth:600, margin:"0 auto" }}>
      {confirmDel && <ConfirmModal message={`Supprimer "${confirmDel.name}" ?`} onConfirm={()=>doDelete(confirmDel.id)} onCancel={()=>setConfirmDel(null)}/>}
      <div style={{ marginBottom:20 }}>
        <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:900, color:T.text, margin:"0 0 4px" }}>Vendeurs</h2>
        <p style={{ color:T.sub, fontSize:13, fontFamily:"'Syne',sans-serif" }}>{sellers.filter(s=>s.active).length} actif{sellers.filter(s=>s.active).length>1?"s":""} · {sellers.length} total</p>
      </div>
      <div style={{ display:"flex", gap:10, marginBottom:22 }}>
        <input value={name} onChange={e=>setName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&add()} placeholder="Prénom du vendeur" style={{ ...inputStyle, flex:1 }}/>
        <button onClick={add} disabled={saving||!name.trim()} style={{ ...btnPrimary, opacity:!name.trim()?0.4:1 }}>+ Ajouter</button>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:9 }}>
        {sellers.map((s,i)=>{
          const c=SELLER_COLORS[i%SELLER_COLORS.length];
          return (
            <div key={s.id} style={{ background:T.surface, borderRadius:12, padding:"14px 18px", border:`1px solid ${T.border}`, display:"flex", alignItems:"center", gap:14, opacity:s.active?1:0.5, boxShadow:"0 1px 4px rgba(0,0,0,0.05)" }}>
              <div style={{ width:40, height:40, borderRadius:11, background:c+"18", border:`2px solid ${c}44`, display:"flex", alignItems:"center", justifyContent:"center", color:c, fontWeight:900, fontSize:14, flexShrink:0 }}>{initials(s.name)}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, color:T.text, fontSize:15 }}>{s.name}</div>
                <div style={{ color:s.active?"#059669":"#9CA3AF", fontSize:11, marginTop:2 }}>{s.active?"● Actif":"○ Inactif"}</div>
              </div>
              <button onClick={()=>toggle(s)} style={{ background:s.active?T.bg:"#D1FAE5", border:`1px solid ${T.border}`, borderRadius:8, padding:"6px 12px", color:s.active?T.sub:"#059669", fontSize:12, cursor:"pointer", fontFamily:"'Syne',sans-serif", fontWeight:600 }}>{s.active?"Désactiver":"Réactiver"}</button>
              <button onClick={()=>setConfirmDel(s)} style={{ background:"#FEF2F2", border:"1px solid #FECACA", borderRadius:8, padding:"6px 10px", color:"#EF4444", fontSize:12, cursor:"pointer" }}>🗑</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Admin Offers ──────────────────────────────────────────────────────────────
function AdminOffers({ offers, reload }) {
  const [showForm,setShowForm]=useState(false);
  const [editingId,setEditingId]=useState(null);
  const [form,setForm]=useState({ label:"", price_ht:"", category:"PRO" });
  const [filterCat,setFilterCat]=useState("ALL");
  const [confirmDel,setConfirmDel]=useState(null);
  const [saving,setSaving]=useState(false);

  const filtered = filterCat==="ALL" ? offers : offers.filter(o=>o.category===filterCat);
  const counts = { PRO:offers.filter(o=>o.category==="PRO").length, Joueur:offers.filter(o=>o.category==="Joueur").length };
  const previewGames = extractNbGames(form.label);

  function openNew()   { setEditingId(null); setForm({ label:"", price_ht:"", price_ttc:"", category:"PRO", url:"" }); setShowForm(true); }
  function openEdit(o) { setEditingId(o.id); setForm({ label:o.label, price_ht:o.price_ht, price_ttc:ttc(o.price_ht), category:o.category, url:o.url||"" }); setShowForm(true); }

  async function saveOffer() {
    if (!form.label||(!form.price_ht&&!form.price_ttc)) return;
    const ht = form.price_ht
      ? parseFloat(String(form.price_ht).replace(",","."))
      : Math.round(parseFloat(String(form.price_ttc).replace(",","."))/1.2*100)/100;
    if (isNaN(ht)) return;
    setSaving(true);
    const payload = { label:form.label, price_ht:ht, category:form.category, url:form.url||null };
    if (editingId) await sb.from("offers").update(payload).eq("id",editingId);
    else await sb.from("offers").insert({ ...payload, sort_order:offers.length });
    await reload(); setSaving(false); setShowForm(false);
  }
  async function doDelete(id) {
    await sb.from("offers").delete().eq("id",id);
    setConfirmDel(null); reload();
  }
  async function handleQR(id, file) {
    const reader=new FileReader();
    reader.onload=async ev=>{
      await sb.from("offers").update({ qr:ev.target.result }).eq("id",id);
      reload();
    };
    reader.readAsDataURL(file);
  }
  async function moveOffer(id, dir) {
    const idx=offers.findIndex(o=>o.id===id);
    if (idx===-1) return;
    const swapIdx=idx+dir;
    if (swapIdx<0||swapIdx>=offers.length) return;
    const a=offers[idx], b=offers[swapIdx];
    await sb.from("offers").update({ sort_order:b.sort_order }).eq("id",a.id);
    await sb.from("offers").update({ sort_order:a.sort_order }).eq("id",b.id);
    reload();
  }

  return (
    <div style={{ padding:"24px 20px", maxWidth:800, margin:"0 auto" }}>
      {confirmDel && <ConfirmModal message={`Supprimer "${confirmDel.label}" ?`} onConfirm={()=>doDelete(confirmDel.id)} onCancel={()=>setConfirmDel(null)}/>}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:18 }}>
        <div>
          <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:900, color:T.text, margin:0 }}>Offres tarifaires</h2>
          <p style={{ color:T.sub, fontSize:13, margin:"4px 0 0", fontFamily:"'Syne',sans-serif" }}>{offers.length} offres · {counts.PRO} PRO · {counts.Joueur} Joueur</p>
        </div>
        <button onClick={openNew} style={btnPrimary}>+ Nouvelle offre</button>
      </div>

      <div style={{ display:"flex", gap:8, marginBottom:18 }}>
        {[["ALL","Toutes"],["PRO","💼 PRO"],["Joueur","🎮 Joueur"]].map(([v,label])=>{
          const active=filterCat===v;
          const c=v==="PRO"?CAT_COLORS.PRO:v==="Joueur"?CAT_COLORS.Joueur:T.sub;
          return (
            <button key={v} onClick={()=>setFilterCat(v)} style={{ background:active?c+"18":T.surface, border:`1.5px solid ${active?c:T.border}`, borderRadius:8, padding:"7px 16px", color:active?c:T.sub, fontWeight:700, fontSize:13, cursor:"pointer", fontFamily:"'Syne',sans-serif" }}>
              {label}{v!=="ALL"&&<span style={{ opacity:0.6, fontSize:11 }}> ({counts[v]||0})</span>}
            </button>
          );
        })}
      </div>

      {showForm && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.4)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
          <div style={{ background:T.surface, borderRadius:18, padding:28, width:"100%", maxWidth:440, border:`1px solid ${T.border}`, boxShadow:"0 20px 60px rgba(0,0,0,0.15)" }}>
            <h3 style={{ fontFamily:"'Syne',sans-serif", color:T.text, margin:"0 0 22px", fontSize:18, fontWeight:800 }}>{editingId?"Modifier":"Nouvelle offre"}</h3>
            <div style={{ marginBottom:14 }}>
              <label style={{ color:T.sub, fontSize:11, display:"block", marginBottom:6, fontFamily:"'Syne',sans-serif", fontWeight:700, letterSpacing:1 }}>CATÉGORIE</label>
              <div style={{ display:"flex", gap:8 }}>
                {["PRO","Joueur"].map(cat=>{
                  const c=CAT_COLORS[cat], active=form.category===cat;
                  return <button key={cat} onClick={()=>setForm({...form,category:cat})} style={{ flex:1, background:active?c+"18":T.bg, border:`2px solid ${active?c:T.border}`, borderRadius:10, padding:11, color:active?c:T.sub, fontWeight:800, fontSize:14, cursor:"pointer", fontFamily:"'Syne',sans-serif" }}>{CAT_ICONS[cat]} {cat}</button>;
                })}
              </div>
            </div>
            <div style={{ marginBottom:14 }}>
              <label style={{ color:T.sub, fontSize:11, display:"block", marginBottom:6, fontFamily:"'Syne',sans-serif", fontWeight:700, letterSpacing:1 }}>INTITULÉ *</label>
              <input value={form.label} onChange={e=>setForm({...form,label:e.target.value})} placeholder="Ex: TARIF SUPER PRO - 3 Ditchs" style={inputStyle}/>
              {form.label && (
                <div style={{ marginTop:6, padding:"5px 10px", background:"#EDE9FE", borderRadius:7, border:"1px solid #C4B5FD", display:"inline-flex", alignItems:"center", gap:6 }}>
                  <span style={{ color:"#7C3AED", fontSize:11, fontFamily:"'Syne',sans-serif" }}>🎮 Jeux détectés :</span>
                  <span style={{ color:"#5B21B6", fontWeight:800, fontSize:13, fontFamily:"'Syne',sans-serif" }}>{previewGames} jeu{previewGames>1?"x":""}</span>
                </div>
              )}
            </div>
            <div style={{ marginBottom:14 }}>
              <label style={{ color:T.sub, fontSize:11, display:"block", marginBottom:6, fontFamily:"'Syne',sans-serif", fontWeight:700, letterSpacing:1 }}>PRIX (TVA 20% — remplissez HT ou TTC)</label>
              <div style={{ display:"flex", gap:8 }}>
                <div style={{ flex:1, position:"relative" }}>
                  <input value={form.price_ht} onChange={e=>{
                    const v=e.target.value;
                    const n=parseFloat(String(v).replace(",","."));
                    setForm({...form, price_ht:v, price_ttc:isNaN(n)?"":Math.round(n*1.2*100)/100});
                  }} placeholder="Ex: 9,00" style={{ ...inputStyle, paddingRight:40, fontWeight:700 }}/>
                  <span style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", color:T.muted, fontSize:10 }}>€ HT</span>
                </div>
                <div style={{ flex:1, position:"relative" }}>
                  <input value={form.price_ttc} onChange={e=>{
                    const v=e.target.value;
                    const n=parseFloat(String(v).replace(",","."));
                    setForm({...form, price_ttc:v, price_ht:isNaN(n)?"":Math.round(n/1.2*100)/100});
                  }} placeholder="Ex: 10,80" style={{ ...inputStyle, paddingRight:44, fontWeight:700, background:"#D1FAE5", border:"1px solid #6EE7B7" }}/>
                  <span style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", color:"#059669", fontSize:10 }}>€ TTC</span>
                </div>
              </div>
            </div>
            <div style={{ marginBottom:22 }}>
              <label style={{ color:T.sub, fontSize:11, display:"block", marginBottom:6, fontFamily:"'Syne',sans-serif", fontWeight:700, letterSpacing:1 }}>LIEN DE PAIEMENT (facultatif)</label>
              <input value={form.url} onChange={e=>setForm({...form,url:e.target.value})} placeholder="https://..." style={inputStyle}/>
            </div>
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={()=>setShowForm(false)} style={{ flex:1, ...btnGhost }}>Annuler</button>
              <button onClick={saveOffer} disabled={saving} style={{ flex:2, ...btnPrimary, opacity:saving?0.6:1 }}>{saving?"...":"Enregistrer"}</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display:"flex", flexDirection:"column", gap:9 }}>
        {filtered.map((offer)=>{
          const c=CAT_COLORS[offer.category], cb=CAT_COLORS2[offer.category], ng=extractNbGames(offer.label);
          const globalIdx=offers.findIndex(o=>o.id===offer.id);
          return (
            <div key={offer.id} style={{ background:T.surface, borderRadius:12, padding:"13px 16px", border:`1px solid ${T.border}`, display:"flex", gap:10, alignItems:"center", boxShadow:"0 1px 4px rgba(0,0,0,0.05)" }}>
              <div style={{ display:"flex", flexDirection:"column", gap:2, flexShrink:0 }}>
                <button onClick={()=>moveOffer(offer.id,-1)} disabled={globalIdx===0} style={{ background:"none", border:"none", cursor:globalIdx===0?"default":"pointer", color:globalIdx===0?T.border:T.muted, fontSize:13, padding:"1px 4px", lineHeight:1 }}>▲</button>
                <button onClick={()=>moveOffer(offer.id,+1)} disabled={globalIdx===offers.length-1} style={{ background:"none", border:"none", cursor:globalIdx===offers.length-1?"default":"pointer", color:globalIdx===offers.length-1?T.border:T.muted, fontSize:13, padding:"1px 4px", lineHeight:1 }}>▼</button>
              </div>
              <div style={{ padding:"3px 9px", borderRadius:6, background:cb, color:c, fontSize:10, fontWeight:800, fontFamily:"'Syne',sans-serif", letterSpacing:0.5, flexShrink:0 }}>{offer.category}</div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, color:T.text, fontSize:14, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{offer.label}</div>
                <div style={{ display:"flex", gap:8, marginTop:3 }}>
                  <span style={{ color:T.muted, fontSize:12 }}>{fmtPrice(offer.price_ht)} HT</span>
                  <span style={{ color:c, fontSize:12, fontWeight:700 }}>{fmtPrice(ttc(offer.price_ht))} TTC</span>
                  <span style={{ color:"#7C3AED", fontSize:12 }}>🎮 {ng} jeu{ng>1?"x":""}</span>
                </div>
              </div>
              <div style={{ flexShrink:0 }}>
                {offer.qr
                  ? <img src={offer.qr} style={{ width:42, height:42, borderRadius:6, border:`2px solid ${c}` }} alt="QR"/>
                  : <div style={{ width:42, height:42, borderRadius:6, background:T.bg, border:`1px dashed ${T.border2}`, display:"flex", alignItems:"center", justifyContent:"center", color:T.muted, fontSize:18 }}>⬜</div>
                }
              </div>
              <div style={{ display:"flex", gap:6, flexShrink:0 }}>
                <label style={{ background:cb, border:`1px solid ${c}44`, borderRadius:7, padding:"6px 10px", color:c, fontSize:11, cursor:"pointer", fontFamily:"'Syne',sans-serif", fontWeight:600 }}>
                  {offer.qr?"↑ QR":"+ QR"}
                  <input type="file" accept="image/*" style={{ display:"none" }} onChange={e=>e.target.files[0]&&handleQR(offer.id,e.target.files[0])}/>
                </label>
                <button onClick={()=>openEdit(offer)} style={{ background:T.bg, border:`1px solid ${T.border}`, borderRadius:7, padding:"6px 10px", color:T.sub, fontSize:11, cursor:"pointer", fontFamily:"'Syne',sans-serif" }}>Modifier</button>
                <button onClick={()=>setConfirmDel(offer)} style={{ background:"#FEF2F2", border:"1px solid #FECACA", borderRadius:7, padding:"6px 8px", color:"#EF4444", fontSize:11, cursor:"pointer" }}>🗑</button>
              </div>
            </div>
          );
        })}
        {filtered.length===0 && <div style={{ textAlign:"center", color:T.muted, padding:40, fontFamily:"'Syne',sans-serif" }}>Aucune offre</div>}
      </div>
    </div>
  );
}

// ── Admin Sales ───────────────────────────────────────────────────────────────
function AdminSales({ sellers }) {
  const [sales,setSales]=useState([]);
  const [filterSeller,setFilterSeller]=useState("ALL");
  const [loading,setLoading]=useState(true);
  const [editSale,setEditSale]=useState(null);
  const [editForm,setEditForm]=useState({});
  const [confirmDel,setConfirmDel]=useState(null);

  async function loadSales() {
    const {data}=await sb.from("sales").select("*").eq("status","confirmed").order("confirmed_at",{ascending:false});
    setSales(data||[]); setLoading(false);
  }
  useEffect(()=>{ loadSales(); },[]);

  async function doDelete(id) {
    await sb.from("sales").delete().eq("id",id);
    setConfirmDel(null); loadSales();
  }
  async function saveEdit() {
    const nb=parseInt(editForm.nb_games)||1;
    const price=parseFloat(String(editForm.price_ttc).replace(",","."));
    await sb.from("sales").update({ nb_games:nb, price_ttc:isNaN(price)?editSale.price_ttc:price, client_name:editForm.client_name||null, comment:editForm.comment||null }).eq("id",editSale.id);
    setEditSale(null); loadSales();
  }

  const sellerStats=sellers.map((s,i)=>{
    const ss=sales.filter(x=>x.seller_name===s.name);
    return { ...s, color:SELLER_COLORS[i%SELLER_COLORS.length], totalTTC:ss.reduce((a,x)=>a+(x.price_ttc||0),0), totalGames:ss.reduce((a,x)=>a+(x.nb_games||0),0), count:ss.length };
  }).sort((a,b)=>b.totalTTC-a.totalTTC);

  const filtered=sales.filter(s=>filterSeller==="ALL"||s.seller_name===filterSeller);

  return (
    <div style={{ padding:"24px 20px", maxWidth:820, margin:"0 auto" }}>
      {confirmDel && <ConfirmModal message="Supprimer cette vente ?" onConfirm={()=>doDelete(confirmDel)} onCancel={()=>setConfirmDel(null)}/>}

      {editSale && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.4)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
          <div style={{ background:T.surface, borderRadius:18, padding:28, width:"100%", maxWidth:400, border:`1px solid ${T.border}`, boxShadow:"0 20px 60px rgba(0,0,0,0.15)" }}>
            <h3 style={{ fontFamily:"'Syne',sans-serif", color:T.text, margin:"0 0 18px", fontSize:17, fontWeight:800 }}>Modifier la vente</h3>
            <div style={{ color:T.sub, fontSize:12, marginBottom:16, fontFamily:"'Syne',sans-serif" }}>{editSale.offer_label}</div>
            <div style={{ marginBottom:12 }}>
              <label style={{ color:T.sub, fontSize:11, display:"block", marginBottom:5, fontFamily:"'Syne',sans-serif", fontWeight:700 }}>NB JEUX</label>
              <input type="number" min="1" value={editForm.nb_games} onChange={e=>setEditForm({...editForm,nb_games:e.target.value})} style={inputStyle}/>
            </div>
            <div style={{ marginBottom:12 }}>
              <label style={{ color:T.sub, fontSize:11, display:"block", marginBottom:5, fontFamily:"'Syne',sans-serif", fontWeight:700 }}>MONTANT TTC</label>
              <input value={editForm.price_ttc} onChange={e=>setEditForm({...editForm,price_ttc:e.target.value})} style={inputStyle}/>
            </div>
            <div style={{ marginBottom:12 }}>
              <label style={{ color:T.sub, fontSize:11, display:"block", marginBottom:5, fontFamily:"'Syne',sans-serif", fontWeight:700 }}>CLIENT</label>
              <input value={editForm.client_name||""} onChange={e=>setEditForm({...editForm,client_name:e.target.value})} style={inputStyle}/>
            </div>
            <div style={{ marginBottom:20 }}>
              <label style={{ color:T.sub, fontSize:11, display:"block", marginBottom:5, fontFamily:"'Syne',sans-serif", fontWeight:700 }}>COMMENTAIRE</label>
              <input value={editForm.comment||""} onChange={e=>setEditForm({...editForm,comment:e.target.value})} style={inputStyle}/>
            </div>
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={()=>setEditSale(null)} style={{ flex:1, ...btnGhost }}>Annuler</button>
              <button onClick={saveEdit} style={{ flex:2, ...btnPrimary }}>Enregistrer</button>
            </div>
          </div>
        </div>
      )}
      <div style={{ marginBottom:20 }}>
        <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:900, color:T.text, margin:"0 0 4px" }}>Tableau des ventes</h2>
        <p style={{ color:T.sub, fontSize:13, fontFamily:"'Syne',sans-serif" }}>{sales.length} vente{sales.length>1?"s":""} confirmée{sales.length>1?"s":""}</p>
      </div>

      <div style={{ display:"flex", gap:10, marginBottom:22, flexWrap:"wrap" }}>
        {[
          { label:"CA CONFIRMÉ", value:fmtPrice(sales.reduce((a,s)=>a+(s.price_ttc||0),0)), bg:"#D1FAE5", color:"#065F46", border:"#6EE7B7" },
          { label:"JEUX VENDUS", value:sales.reduce((a,s)=>a+(s.nb_games||0),0), bg:"#EDE9FE", color:"#5B21B6", border:"#C4B5FD" },
        ].map(k=>(
          <div key={k.label} style={{ background:k.bg, border:`1px solid ${k.border}`, borderRadius:12, padding:"14px 18px", flex:"1 1 110px" }}>
            <div style={{ color:k.color+"99", fontSize:10, fontFamily:"'Syne',sans-serif", fontWeight:700, letterSpacing:1.2, marginBottom:4 }}>{k.label}</div>
            <div style={{ color:k.color, fontWeight:900, fontSize:22, fontFamily:"'Syne',sans-serif" }}>{k.value}</div>
          </div>
        ))}
      </div>

      {sellerStats.length>0 && (
        <div style={{ marginBottom:22 }}>
          <div style={{ color:T.muted, fontSize:11, fontFamily:"'Syne',sans-serif", fontWeight:700, letterSpacing:1.5, marginBottom:10 }}>CLASSEMENT</div>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {sellerStats.map((s,i)=>{
              const medal=["🥇","🥈","🥉"][i]||null;
              return (
                <div key={s.id} style={{ background:T.surface, borderRadius:12, padding:"13px 16px", border:`1px solid ${i===0&&s.count>0?s.color+"55":T.border}`, display:"flex", alignItems:"center", gap:14, boxShadow:"0 1px 4px rgba(0,0,0,0.05)" }}>
                  <div style={{ width:36, height:36, borderRadius:10, background:s.color+"18", border:`2px solid ${s.color}44`, display:"flex", alignItems:"center", justifyContent:"center", color:s.color, fontWeight:900, fontSize:14, flexShrink:0 }}>{medal&&s.count>0?medal:initials(s.name)}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, color:T.text, fontSize:15 }}>{s.name}</div>
                    <div style={{ color:T.sub, fontSize:12, marginTop:2 }}>{s.count} vente{s.count>1?"s":""} · <svg width={12} height={12} viewBox="0 0 24 24" fill="none" style={{verticalAlign:"middle"}}><polygon points="12,2 22,7 12,12 2,7" fill="#FFE600" stroke="#C8B400" strokeWidth="1"/><polygon points="2,7 2,17 12,22 12,12" fill="#D4AC00" stroke="#C8B400" strokeWidth="1"/><polygon points="22,7 22,17 12,22 12,12" fill="#FFD000" stroke="#C8B400" strokeWidth="1"/></svg> {s.totalGames} jeu{s.totalGames>1?"x":""}</div>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <div style={{ color:s.count>0?s.color:T.muted, fontWeight:900, fontFamily:"'Syne',sans-serif", fontSize:18 }}>{fmtPrice(s.totalTTC)}</div>
                    <div style={{ color:T.muted, fontSize:11 }}>TTC</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div style={{ display:"flex", gap:8, marginBottom:12, flexWrap:"wrap" }}>
        <button onClick={()=>setFilterSeller("ALL")} style={{ background:filterSeller==="ALL"?"#D1FAE5":T.surface, border:`1px solid ${filterSeller==="ALL"?"#059669":T.border}`, borderRadius:8, padding:"6px 12px", color:filterSeller==="ALL"?"#059669":T.sub, fontWeight:700, fontSize:12, cursor:"pointer", fontFamily:"'Syne',sans-serif" }}>Tous</button>
        {sellers.map((s,i)=>(
          <button key={s.id} onClick={()=>setFilterSeller(s.name)} style={{ background:filterSeller===s.name?SELLER_COLORS[i%SELLER_COLORS.length]+"18":T.surface, border:`1px solid ${filterSeller===s.name?SELLER_COLORS[i%SELLER_COLORS.length]:T.border}`, borderRadius:8, padding:"6px 12px", color:filterSeller===s.name?SELLER_COLORS[i%SELLER_COLORS.length]:T.sub, fontWeight:700, fontSize:12, cursor:"pointer", fontFamily:"'Syne',sans-serif" }}>{s.name}</button>
        ))}
      </div>

      {loading ? <div style={{ textAlign:"center", color:T.muted, padding:40, fontFamily:"'Syne',sans-serif" }}>Chargement…</div> : (
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {filtered.map(s=>{
            const c=CAT_COLORS[s.category]||T.sub, cb=CAT_COLORS2[s.category]||T.bg;
            return (
              <div key={s.id} style={{ background:T.surface, borderRadius:10, padding:"12px 16px", border:`1px solid ${T.border}`, display:"flex", alignItems:"center", gap:12, boxShadow:"0 1px 3px rgba(0,0,0,0.04)" }}>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, color:T.text, fontSize:13, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{s.offer_label}</div>
                  <div style={{ color:T.sub, fontSize:11, marginTop:2 }}>
                    {s.seller_name} · Confirmé {fmtDate(s.confirmed_at)}
                    {s.client_name && <span style={{ color:T.text }}> · 👤 {s.client_name}</span>}
                    {s.comment     && <span style={{ color:"#7C3AED" }}> · 💬 {s.comment}</span>}
                  </div>
                </div>
                <div style={{ padding:"2px 8px", borderRadius:6, background:cb, color:c, fontSize:11, fontWeight:700, flexShrink:0 }}>{s.category}</div>
                <div style={{ color:"#7C3AED", fontSize:12, fontWeight:600, flexShrink:0, display:"flex", alignItems:"center", gap:3 }}><svg width={13} height={13} viewBox="0 0 24 24" fill="none"><polygon points="12,2 22,7 12,12 2,7" fill="#FFE600" stroke="#C8B400" strokeWidth="1"/><polygon points="2,7 2,17 12,22 12,12" fill="#D4AC00" stroke="#C8B400" strokeWidth="1"/><polygon points="22,7 22,17 12,22 12,12" fill="#FFD000" stroke="#C8B400" strokeWidth="1"/></svg> ×{s.nb_games}</div>
                <div style={{ color:c, fontWeight:800, fontFamily:"'Syne',sans-serif", fontSize:15, flexShrink:0 }}>{fmtPrice(s.price_ttc)}</div>
                <div style={{ display:"flex", gap:5, flexShrink:0 }}>
                  <button onClick={()=>{ setEditSale(s); setEditForm({nb_games:s.nb_games, price_ttc:s.price_ttc, client_name:s.client_name||"", comment:s.comment||""}); }} style={{ background:T.bg, border:`1px solid ${T.border}`, borderRadius:7, padding:"5px 9px", color:T.sub, fontSize:11, cursor:"pointer" }}>✏️</button>
                  <button onClick={()=>setConfirmDel(s.id)} style={{ background:"#FEF2F2", border:"1px solid #FECACA", borderRadius:7, padding:"5px 9px", color:"#EF4444", fontSize:11, cursor:"pointer" }}>🗑</button>
                </div>
              </div>
            );
          })}
          {filtered.length===0 && <div style={{ textAlign:"center", color:T.muted, padding:40, fontFamily:"'Syne',sans-serif" }}>Aucune vente confirmée</div>}
        </div>
      )}
    </div>
  );
}

// ── Copy URL Button ───────────────────────────────────────────────────────────
function CopyUrlButton({ url }) {
  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard.writeText(url).then(()=>{ setCopied(true); setTimeout(()=>setCopied(false),2000); });
  }
  return (
    <div style={{ width:"100%", marginBottom:14 }}>
      <div style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:12, padding:"10px 14px", display:"flex", alignItems:"center", gap:10 }}>
        <span style={{ fontSize:16 }}>🔗</span>
        <span style={{ flex:1, color:T.sub, fontSize:12, fontFamily:"'Syne',sans-serif", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{url}</span>
        <button onClick={copy} style={{ background:copied?"#D1FAE5":"linear-gradient(135deg,#059669,#047857)", border:"none", borderRadius:8, padding:"7px 14px", color:copied?"#065F46":"#fff", fontWeight:700, fontSize:12, cursor:"pointer", fontFamily:"'Syne',sans-serif", flexShrink:0, transition:"all 0.2s" }}>
          {copied?"✓ Copié !":"📋 Copier"}
        </button>
      </div>
    </div>
  );
}

// ── Sales View ────────────────────────────────────────────────────────────────
function SalesView({ offers, seller }) {
  const [category,setCategory]=useState("Joueur");
  const [search,setSearch]=useState("");
  const [selected,setSelected]=useState(null);
  const [saleId,setSaleId]=useState(null);
  const [confirming,setConfirming]=useState(false);
  const [confirmed,setConfirmed]=useState(false);
  const [clientName,setClientName]=useState("");
  const [comment,setComment]=useState("");
  const [showLinks,setShowLinks]=useState(false);

  if (showLinks) return <LinksView onBack={()=>setShowLinks(false)}/>;


  const filtered=offers.filter(o=>o.category===category&&(!search||o.label.toLowerCase().includes(search.toLowerCase())));
  const counts={ PRO:offers.filter(o=>o.category==="PRO").length, Joueur:offers.filter(o=>o.category==="Joueur").length };

  // Icône boîte 3D jaune
  const BoxIcon = ({size=18}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{display:"inline-block",verticalAlign:"middle"}}>
      <polygon points="12,2 22,7 12,12 2,7" fill="#FFE600" stroke="#C8B400" strokeWidth="1"/>
      <polygon points="2,7 2,17 12,22 12,12" fill="#D4AC00" stroke="#C8B400" strokeWidth="1"/>
      <polygon points="22,7 22,17 12,22 12,12" fill="#FFD000" stroke="#C8B400" strokeWidth="1"/>
    </svg>
  );

  async function presentOffer(offer) {
    setSelected(offer); setSaleId(null); setConfirmed(false); setClientName(""); setComment("");
    const ng=extractNbGames(offer.label);
    const { data }=await sb.from("sales").insert({
      seller_id:seller.id, seller_name:seller.name,
      offer_id:offer.id, offer_label:offer.label, category:offer.category,
      price_ttc:ttc(offer.price_ht), nb_games:ng,
      status:"presented", presented_at:new Date().toISOString()
    }).select().single();
    if (data) setSaleId(data.id);
  }
  async function confirmSale() {
    if (!saleId) return;
    setConfirming(true);
    await sb.from("sales").update({
      status:"confirmed", confirmed_at:new Date().toISOString(),
      client_name:clientName.trim()||null, comment:comment.trim()||null
    }).eq("id",saleId);
    setConfirming(false); setConfirmed(true);
    setTimeout(()=>{ setConfirmed(false); setSelected(null); setSaleId(null); },2500);
  }

  if (selected) {
    const sc=CAT_COLORS[selected.category], scb=CAT_COLORS2[selected.category], ng=extractNbGames(selected.label);
    return (
      <div style={{ minHeight:"calc(100vh - 56px)", background:T.bg, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:24, position:"relative" }}>
        <button onClick={()=>{ setSelected(null); setSaleId(null); setConfirmed(false); }} style={{ position:"absolute", top:20, left:20, ...btnGhost, fontSize:13 }}>← Retour</button>
        {confirmed && (
          <div style={{ position:"absolute", top:16, left:16, right:16, background:"#D1FAE5", border:"1px solid #6EE7B7", borderRadius:12, padding:"14px 18px", color:"#065F46", fontFamily:"'Syne',sans-serif", fontWeight:700, textAlign:"center", fontSize:14, zIndex:10 }}>
            🎉 Vente confirmée et enregistrée !
          </div>
        )}
        <div style={{ textAlign:"center", maxWidth:360, width:"100%" }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"5px 14px", borderRadius:20, background:scb, color:sc, fontSize:11, fontWeight:800, fontFamily:"'Syne',sans-serif", marginBottom:14, letterSpacing:1 }}>
            {CAT_ICONS[selected.category]} TARIF {selected.category.toUpperCase()}
          </div>
          <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight:900, fontSize:20, color:T.text, margin:"0 0 14px", lineHeight:1.3 }}>{selected.label}</h2>
          <div style={{ display:"flex", gap:10, justifyContent:"center", marginBottom:16 }}>
            <div style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:10, padding:"9px 16px" }}>
              <div style={{ color:T.muted, fontSize:10, fontFamily:"'Syne',sans-serif", marginBottom:2 }}>HT</div>
              <div style={{ color:T.sub, fontWeight:700, fontFamily:"'Syne',sans-serif" }}>{fmtPrice(selected.price_ht)}</div>
            </div>
            <div style={{ background:scb, border:`2px solid ${sc}66`, borderRadius:10, padding:"9px 22px" }}>
              <div style={{ color:sc+"99", fontSize:10, fontFamily:"'Syne',sans-serif", marginBottom:2 }}>TTC</div>
              <div style={{ color:sc, fontWeight:900, fontSize:22, fontFamily:"'Syne',sans-serif" }}>{fmtPrice(ttc(selected.price_ht))}</div>
            </div>
            <div style={{ background:"#EDE9FE", border:"1px solid #C4B5FD", borderRadius:10, padding:"9px 14px" }}>
              <div style={{ color:"#7C3AED99", fontSize:10, fontFamily:"'Syne',sans-serif", marginBottom:2 }}>JEUX</div>
              <div style={{ color:"#7C3AED", fontWeight:900, fontSize:22, fontFamily:"'Syne',sans-serif", display:"flex", alignItems:"center", gap:4 }}>
                <svg width={20} height={20} viewBox="0 0 24 24" fill="none"><polygon points="12,2 22,7 12,12 2,7" fill="#FFE600" stroke="#C8B400" strokeWidth="1"/><polygon points="2,7 2,17 12,22 12,12" fill="#D4AC00" stroke="#C8B400" strokeWidth="1"/><polygon points="22,7 22,17 12,22 12,12" fill="#FFD000" stroke="#C8B400" strokeWidth="1"/></svg>
                {ng}
              </div>
            </div>
          </div>
          <div style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"5px 12px", borderRadius:20, background:confirmed?"#D1FAE5":"#FEF9C3", border:`1px solid ${confirmed?"#6EE7B7":"#FDE68A"}`, color:confirmed?"#065F46":"#713F12", fontSize:11, fontWeight:700, fontFamily:"'Syne',sans-serif", marginBottom:16 }}>
            <span style={{ width:6, height:6, borderRadius:"50%", background:confirmed?"#059669":"#EAB308", display:"inline-block" }}/>
            {confirmed?"Vente confirmée":"QR présenté — en attente de confirmation"}
          </div>
          <div style={{ background:T.surface, borderRadius:20, padding:18, display:"inline-block", boxShadow:`0 8px 40px ${sc}33, 0 2px 12px rgba(0,0,0,0.1)`, border:`3px solid ${confirmed?"#059669":sc}`, transition:"border 0.4s", marginBottom:16 }}>
            {selected.qr
              ? <img src={selected.qr} style={{ width:220, height:220, display:"block", borderRadius:8 }} alt="QR"/>
              : <div style={{ width:220, height:220, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:10 }}>
                  <div style={{ fontSize:44 }}>⬜</div>
                  <div style={{ color:T.muted, fontSize:12, fontFamily:"'Syne',sans-serif" }}>QR non uploadé</div>
                </div>
            }
          </div>
          <p style={{ color:T.muted, fontSize:11, marginBottom:12, fontFamily:"'Syne',sans-serif" }}>Présentez ce QR à votre client · confirmez après paiement</p>
          {selected.url && (
            <CopyUrlButton url={selected.url}/>
          )}
          <div style={{ width:"100%", marginBottom:12 }}>
            <input value={clientName} onChange={e=>setClientName(e.target.value)} placeholder="Prénom Nom du client (facultatif)" disabled={confirmed}
              style={{ ...inputStyle, marginBottom:8, opacity:confirmed?0.5:1 }}/>
            <input value={comment} onChange={e=>setComment(e.target.value)} placeholder="Commentaire (facultatif)" disabled={confirmed}
              style={{ ...inputStyle, opacity:confirmed?0.5:1 }}/>
          </div>
          <button onClick={confirmSale} disabled={confirming||confirmed} style={{
            width:"100%", background:confirmed?"#D1FAE5":"linear-gradient(135deg,#059669,#047857)",
            border:confirmed?"1px solid #6EE7B7":"none", borderRadius:14, padding:16,
            color:confirmed?"#065F46":"#fff", fontWeight:900, fontSize:16,
            cursor:confirming||confirmed?"default":"pointer",
            fontFamily:"'Syne',sans-serif", opacity:confirming?0.7:1, transition:"all 0.3s"
          }}>
            {confirmed?"✅ Vente enregistrée !":confirming?"Enregistrement...":"✓ Confirmer la vente"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding:"20px", maxWidth:500, margin:"0 auto" }}>
      <button onClick={()=>setShowLinks(true)} style={{ width:"100%", marginBottom:14, background:T.surface, border:`1.5px solid #C4B5FD`, borderRadius:12, padding:"13px 18px", cursor:"pointer", display:"flex", alignItems:"center", gap:10, fontFamily:"'Syne',sans-serif", boxShadow:"0 2px 8px rgba(124,58,237,0.08)", transition:"all 0.15s" }}
        onMouseEnter={e=>{ e.currentTarget.style.background="#EDE9FE"; }}
        onMouseLeave={e=>{ e.currentTarget.style.background=T.surface; }}>
        <span style={{ fontSize:18 }}>🔗</span>
        <span style={{ fontWeight:800, fontSize:14, color:"#7C3AED", flex:1, textAlign:"left" }}>Liste des liens Délires Games</span>
        <span style={{ color:"#C4B5FD", fontSize:18 }}>›</span>
      </button>
      <div style={{ display:"flex", gap:10, marginBottom:20 }}>
        {["Joueur","PRO"].map(cat=>{
          const c=CAT_COLORS[cat], cb=CAT_COLORS2[cat], active=category===cat;
          return (
            <button key={cat} onClick={()=>{ setCategory(cat); setSearch(""); }} style={{ flex:1, padding:"15px 10px", borderRadius:14, background:active?cb:T.surface, border:`2px solid ${active?c:T.border}`, color:active?c:T.sub, cursor:"pointer", fontFamily:"'Syne',sans-serif", transition:"all 0.2s", textAlign:"center", boxShadow:active?`0 4px 16px ${c}33`:"0 1px 4px rgba(0,0,0,0.05)" }}>
              <div style={{ fontSize:22, marginBottom:4 }}>{CAT_ICONS[cat]}</div>
              <div style={{ fontWeight:900, fontSize:15 }}>Tarifs {cat}</div>
              <div style={{ fontSize:11, opacity:0.6, marginTop:2 }}>{counts[cat]} offre{counts[cat]>1?"s":""}</div>
            </button>
          );
        })}
      </div>
      <div style={{ position:"relative", marginBottom:14 }}>
        <span style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)", color:T.muted, fontSize:15 }}>🔍</span>
        <input placeholder={`Rechercher dans Tarifs ${category}...`} value={search} onChange={e=>setSearch(e.target.value)}
          style={{ ...inputStyle, paddingLeft:38 }}/>
      </div>
      <div style={{ color:T.muted, fontSize:12, marginBottom:12, fontFamily:"'Syne',sans-serif" }}>{filtered.length} offre{filtered.length>1?"s":""}</div>
      <div style={{ display:"flex", flexDirection:"column", gap:9 }}>
        {filtered.map(offer=>{
          const c=CAT_COLORS[offer.category], ng=extractNbGames(offer.label);
          return (
            <button key={offer.id} onClick={()=>presentOffer(offer)} style={{ background:T.surface, border:`1.5px solid ${T.border}`, borderRadius:12, padding:"15px 17px", cursor:"pointer", textAlign:"left", display:"flex", alignItems:"center", gap:13, outline:"none", width:"100%", transition:"all 0.15s", boxShadow:"0 1px 4px rgba(0,0,0,0.05)" }}
              onMouseEnter={e=>{ e.currentTarget.style.borderColor=c; e.currentTarget.style.boxShadow=`0 4px 16px ${c}22`; }}
              onMouseLeave={e=>{ e.currentTarget.style.borderColor=T.border; e.currentTarget.style.boxShadow="0 1px 4px rgba(0,0,0,0.05)"; }}>
              <div style={{ width:42, height:42, borderRadius:8, overflow:"hidden", flexShrink:0, background:T.bg, border:`1px solid ${T.border}`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                {offer.qr?<img src={offer.qr} style={{ width:"100%", height:"100%", objectFit:"cover" }} alt="QR"/>:<span style={{ fontSize:18, opacity:0.3 }}>⬜</span>}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, color:T.text, fontSize:14, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{offer.label}</div>
                <div style={{ display:"flex", gap:8, marginTop:2 }}>
                  <span style={{ color:T.muted, fontSize:11 }}>{fmtPrice(offer.price_ht)} HT</span>
                  <span style={{ color:"#7C3AED", fontSize:11 }}><BoxIcon size={14}/> {ng} jeu{ng>1?"x":""}</span>
                </div>
              </div>
              <div style={{ textAlign:"right", flexShrink:0 }}>
                <div style={{ color:c, fontWeight:900, fontFamily:"'Syne',sans-serif", fontSize:17 }}>{fmtPrice(ttc(offer.price_ht))}</div>
                <div style={{ color:T.muted, fontSize:10, marginTop:1 }}>TTC</div>
              </div>
              <span style={{ color:T.border2, fontSize:20 }}>›</span>
            </button>
          );
        })}
        {filtered.length===0 && <div style={{ textAlign:"center", color:T.muted, padding:40, fontFamily:"'Syne',sans-serif" }}>Aucune offre</div>}
      </div>
      <MolliePayments/>
    </div>
  );
}

// ── Mollie Payments ───────────────────────────────────────────────────────────
function MolliePayments() {
  const [payments,setPayments]=useState([]);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState(null);
  const [refreshed,setRefreshed]=useState(false);

  async function load() {
    setLoading(true); setError(null);
    try {
      const r=await fetch("/api/mollie");
      const d=await r.json();
      if (d._embedded&&d._embedded.payments) setPayments(d._embedded.payments.filter(p=>p.status!=="expired").slice(0,10));
      else setError("Impossible de charger les paiements");
    } catch(e) { setError("Erreur de connexion"); }
    setLoading(false);
  }

  useEffect(()=>{ load(); },[]);

  function refresh() { setRefreshed(true); setTimeout(()=>setRefreshed(false),1000); load(); }

  const statusInfo = {
    paid:        { label:"Payé",        bg:"#D1FAE5", color:"#065F46", icon:"✅" },
    authorized:  { label:"Autorisé",    bg:"#D1FAE5", color:"#065F46", icon:"✅" },
    settled:     { label:"Réglé",       bg:"#D1FAE5", color:"#065F46", icon:"✅" },
    pending:     { label:"En attente",  bg:"#FEF9C3", color:"#713F12", icon:"⏳" },
    open:        { label:"Ouvert",      bg:"#DBEAFE", color:"#1E40AF", icon:"🔵" },
    "in-progress":{ label:"En cours",  bg:"#DBEAFE", color:"#1E40AF", icon:"🔵" },
    failed:      { label:"Échoué",      bg:"#FEF2F2", color:"#991B1B", icon:"❌" },
    canceled:    { label:"Annulé",      bg:"#FEF2F2", color:"#991B1B", icon:"🚫" },
    blocked:     { label:"Bloqué",      bg:"#FEF2F2", color:"#991B1B", icon:"🔒" },
    chargeback:  { label:"Rétrofacturé",bg:"#FEF2F2", color:"#991B1B", icon:"↩️" },
    refunded:    { label:"Remboursé",   bg:"#FFEDD5", color:"#9A3412", icon:"↩️" },
    "partially-refunded":{ label:"Part. remboursé", bg:"#FFEDD5", color:"#9A3412", icon:"↩️" },
  };

  return (
    <div style={{ marginTop:28, paddingTop:20, borderTop:`1px solid ${T.border}` }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
        <div>
          <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:900, fontSize:16, color:T.text }}>💳 Derniers paiements Mollie</div>
          <div style={{ color:T.muted, fontSize:11, marginTop:2 }}>10 dernières transactions (hors expirées)</div>
        </div>
        <button onClick={refresh} style={{ background:refreshed?"#D1FAE5":T.surface, border:`1px solid ${T.border}`, borderRadius:8, padding:"6px 12px", color:refreshed?"#059669":T.sub, fontSize:12, cursor:"pointer", fontFamily:"'Syne',sans-serif", fontWeight:600, transition:"all 0.2s" }}>
          {refreshed?"✓":"↻"} Actualiser
        </button>
      </div>
      {loading && <div style={{ textAlign:"center", color:T.muted, padding:24, fontFamily:"'Syne',sans-serif", fontSize:13 }}>Chargement…</div>}
      {error   && <div style={{ textAlign:"center", color:"#EF4444", padding:16, fontFamily:"'Syne',sans-serif", fontSize:13, background:"#FEF2F2", borderRadius:10, border:"1px solid #FECACA" }}>{error}</div>}
      {!loading&&!error&&(
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {payments.map(p=>{
            const st=statusInfo[p.status]||{ label:p.status, bg:T.bg, color:T.sub, icon:"•" };
            const dt=new Date(p.createdAt);
            const dateStr=dt.toLocaleDateString("fr-FR",{day:"2-digit",month:"2-digit"})+
              " "+dt.toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"});
            const consumerName = p.details?.consumerName || p.billingAddress?.givenName
              ? `${p.billingAddress?.givenName||""} ${p.billingAddress?.familyName||""}`.trim()
              : p.metadata?.consumer_name || null;
            const orderRef = p.orderNumber || p.metadata?.order_id || null;
            return (
              <div key={p.id} style={{ background:T.surface, borderRadius:10, padding:"12px 14px", border:`1px solid ${T.border}`, display:"flex", alignItems:"center", gap:12, boxShadow:"0 1px 3px rgba(0,0,0,0.04)" }}>
                <div style={{ fontSize:20, flexShrink:0 }}>{st.icon}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, color:T.text, fontSize:13, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                    {p.description||"Paiement"}
                  </div>
                  <div style={{ display:"flex", gap:8, marginTop:2, flexWrap:"wrap" }}>
                    <span style={{ color:T.muted, fontSize:11 }}>{dateStr}</span>
                    {consumerName && <span style={{ color:T.sub, fontSize:11, fontWeight:600 }}>👤 {consumerName}</span>}
                    {orderRef     && <span style={{ color:T.muted, fontSize:11 }}>{orderRef}</span>}
                  </div>
                </div>
                <div style={{ padding:"3px 10px", borderRadius:20, background:st.bg, color:st.color, fontSize:11, fontWeight:700, fontFamily:"'Syne',sans-serif", flexShrink:0 }}>{st.label}</div>
                <div style={{ color:CAT_COLORS.PRO, fontWeight:900, fontFamily:"'Syne',sans-serif", fontSize:15, flexShrink:0 }}>
                  {p.amount?Number(p.amount.value).toFixed(2).replace(".",",")+" €":"–"}
                </div>
              </div>
            );
          })}
          {payments.length===0&&<div style={{ textAlign:"center", color:T.muted, padding:24, fontFamily:"'Syne',sans-serif", fontSize:13 }}>Aucun paiement trouvé</div>}
        </div>
      )}
    </div>
  );
}

// ── Links View (commerciaux) ──────────────────────────────────────────────────
function LinksView({ onBack }) {
  const [links,setLinks]=useState([]);
  const [loading,setLoading]=useState(true);
  const [qrModal,setQrModal]=useState(null);
  const [copied,setCopied]=useState(null);

  useEffect(()=>{
    sb.from("links").select("*").order("sort_order").then(({data})=>{ setLinks(data||[]); setLoading(false); });
  },[]);

  function copy(id, url) {
    navigator.clipboard.writeText(url).then(()=>{ setCopied(id); setTimeout(()=>setCopied(null),2000); });
  }

  return (
    <div style={{ minHeight:"100vh", background:T.bg, fontFamily:"'Syne',sans-serif" }}>
      {qrModal && (
        <div onClick={()=>setQrModal(null)} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.7)", zIndex:300, display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
          <div style={{ background:T.surface, borderRadius:20, padding:24, textAlign:"center", maxWidth:320, width:"100%" }} onClick={e=>e.stopPropagation()}>
            <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:15, color:T.text, marginBottom:14 }}>{qrModal.label}</div>
            {qrModal.qr
              ? <img src={qrModal.qr} style={{ width:240, height:240, borderRadius:10, display:"block", margin:"0 auto" }} alt="QR"/>
              : <div style={{ width:240, height:240, margin:"0 auto", background:T.bg, borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", color:T.muted, fontSize:13 }}>Pas de QR</div>
            }
            <button onClick={()=>setQrModal(null)} style={{ marginTop:18, ...btnGhost, width:"100%" }}>Fermer</button>
          </div>
        </div>
      )}
      <NavBar right={<button onClick={onBack} style={{ ...btnGhost, fontSize:12 }}>← Retour</button>}/>
      <div style={{ padding:"24px 20px", maxWidth:500, margin:"0 auto" }}>
        <div style={{ marginBottom:20 }}>
          <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:900, color:T.text, margin:"0 0 4px" }}>🔗 Liens Délires Games</h2>
          <p style={{ color:T.sub, fontSize:13, margin:0 }}>Copiez et partagez à vos clients</p>
        </div>
        {loading && <div style={{ textAlign:"center", color:T.muted, padding:40 }}>Chargement…</div>}
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {links.map(link=>(
            <div key={link.id} style={{ background:T.surface, borderRadius:14, padding:"16px 18px", border:`1px solid ${T.border}`, boxShadow:"0 2px 8px rgba(0,0,0,0.05)" }}>
              <div style={{ display:"flex", alignItems:"flex-start", gap:10, marginBottom:10 }}>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, color:T.text, fontSize:15 }}>{link.label}</div>
                  {link.description && <div style={{ color:T.sub, fontSize:12, marginTop:3 }}>{link.description}</div>}
                  <div style={{ color:T.muted, fontSize:11, marginTop:4, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{link.url}</div>
                </div>
                {link.qr && (
                  <button onClick={()=>setQrModal(link)} style={{ background:"#EDE9FE", border:"1px solid #C4B5FD", borderRadius:9, padding:"8px 10px", cursor:"pointer", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center" }} title="Voir le QR code">
                    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
                      <rect x="5" y="5" width="3" height="3" fill="#7C3AED" stroke="none"/><rect x="16" y="5" width="3" height="3" fill="#7C3AED" stroke="none"/><rect x="5" y="16" width="3" height="3" fill="#7C3AED" stroke="none"/>
                      <path d="M14 14h3v3h-3z" fill="#7C3AED" stroke="none"/><path d="M17 17h4"/><path d="M21 14v3"/>
                    </svg>
                  </button>
                )}
              </div>
              <button onClick={()=>copy(link.id, link.url)} style={{ width:"100%", background:copied===link.id?"#D1FAE5":"linear-gradient(135deg,#059669,#047857)", border:copied===link.id?"1px solid #6EE7B7":"none", borderRadius:10, padding:"10px", color:copied===link.id?"#065F46":"#fff", fontWeight:800, fontSize:13, cursor:"pointer", fontFamily:"'Syne',sans-serif", transition:"all 0.2s" }}>
                {copied===link.id?"✓ Lien copié !":"📋 Copier le lien"}
              </button>
            </div>
          ))}
          {!loading&&links.length===0 && <div style={{ textAlign:"center", color:T.muted, padding:40 }}>Aucun lien configuré</div>}
        </div>
      </div>
    </div>
  );
}

// ── Admin Links ───────────────────────────────────────────────────────────────
function AdminLinks() {
  const [links,setLinks]=useState([]);
  const [showForm,setShowForm]=useState(false);
  const [editingId,setEditingId]=useState(null);
  const [form,setForm]=useState({ label:"", description:"", url:"" });
  const [saving,setSaving]=useState(false);
  const [confirmDel,setConfirmDel]=useState(null);

  async function reload() {
    const {data}=await sb.from("links").select("*").order("sort_order");
    setLinks(data||[]);
  }
  useEffect(()=>{ reload(); },[]);

  function openNew()   { setEditingId(null); setForm({ label:"", description:"", url:"" }); setShowForm(true); }
  function openEdit(l) { setEditingId(l.id); setForm({ label:l.label, description:l.description||"", url:l.url }); setShowForm(true); }

  async function save() {
    if (!form.label||!form.url) return;
    setSaving(true);
    if (editingId) await sb.from("links").update({ label:form.label, description:form.description, url:form.url }).eq("id",editingId);
    else await sb.from("links").insert({ label:form.label, description:form.description, url:form.url, sort_order:links.length });
    await reload(); setSaving(false); setShowForm(false);
  }
  async function doDelete(id) { await sb.from("links").delete().eq("id",id); setConfirmDel(null); reload(); }

  async function handleQR(id, file) {
    const reader=new FileReader();
    reader.onload=async ev=>{ await sb.from("links").update({ qr:ev.target.result }).eq("id",id); reload(); };
    reader.readAsDataURL(file);
  }
  async function move(id, dir) {
    const idx=links.findIndex(l=>l.id===id); if(idx===-1) return;
    const swapIdx=idx+dir; if(swapIdx<0||swapIdx>=links.length) return;
    const a=links[idx], b=links[swapIdx];
    await sb.from("links").update({ sort_order:b.sort_order }).eq("id",a.id);
    await sb.from("links").update({ sort_order:a.sort_order }).eq("id",b.id);
    reload();
  }

  return (
    <div style={{ padding:"24px 20px", maxWidth:800, margin:"0 auto" }}>
      {confirmDel && <ConfirmModal message="Supprimer ce lien ?" onConfirm={()=>doDelete(confirmDel)} onCancel={()=>setConfirmDel(null)}/>}

      {showForm && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.4)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
          <div style={{ background:T.surface, borderRadius:18, padding:28, width:"100%", maxWidth:440, border:`1px solid ${T.border}`, boxShadow:"0 20px 60px rgba(0,0,0,0.15)" }}>
            <h3 style={{ fontFamily:"'Syne',sans-serif", color:T.text, margin:"0 0 20px", fontSize:18, fontWeight:800 }}>{editingId?"Modifier":"Nouveau lien"}</h3>
            <div style={{ marginBottom:13 }}>
              <label style={{ color:T.sub, fontSize:11, display:"block", marginBottom:5, fontFamily:"'Syne',sans-serif", fontWeight:700, letterSpacing:1 }}>NOM *</label>
              <input value={form.label} onChange={e=>setForm({...form,label:e.target.value})} placeholder="Ex: Instagram Délires Games" style={inputStyle}/>
            </div>
            <div style={{ marginBottom:13 }}>
              <label style={{ color:T.sub, fontSize:11, display:"block", marginBottom:5, fontFamily:"'Syne',sans-serif", fontWeight:700, letterSpacing:1 }}>DESCRIPTION</label>
              <input value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="Ex: Notre page Instagram officielle" style={inputStyle}/>
            </div>
            <div style={{ marginBottom:22 }}>
              <label style={{ color:T.sub, fontSize:11, display:"block", marginBottom:5, fontFamily:"'Syne',sans-serif", fontWeight:700, letterSpacing:1 }}>URL *</label>
              <input value={form.url} onChange={e=>setForm({...form,url:e.target.value})} placeholder="https://..." style={inputStyle}/>
            </div>
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={()=>setShowForm(false)} style={{ flex:1, ...btnGhost }}>Annuler</button>
              <button onClick={save} disabled={saving} style={{ flex:2, ...btnPrimary, opacity:saving?0.6:1 }}>{saving?"...":"Enregistrer"}</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
        <div>
          <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:900, color:T.text, margin:0 }}>Liens Délires Games</h2>
          <p style={{ color:T.sub, fontSize:13, margin:"4px 0 0", fontFamily:"'Syne',sans-serif" }}>{links.length} lien{links.length>1?"s":""}</p>
        </div>
        <button onClick={openNew} style={btnPrimary}>+ Nouveau lien</button>
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:9 }}>
        {links.map((link,globalIdx)=>(
          <div key={link.id} style={{ background:T.surface, borderRadius:12, padding:"13px 16px", border:`1px solid ${T.border}`, display:"flex", gap:10, alignItems:"center", boxShadow:"0 1px 4px rgba(0,0,0,0.05)" }}>
            <div style={{ display:"flex", flexDirection:"column", gap:2, flexShrink:0 }}>
              <button onClick={()=>move(link.id,-1)} disabled={globalIdx===0} style={{ background:"none", border:"none", cursor:globalIdx===0?"default":"pointer", color:globalIdx===0?T.border:T.muted, fontSize:13, padding:"1px 4px" }}>▲</button>
              <button onClick={()=>move(link.id,+1)} disabled={globalIdx===links.length-1} style={{ background:"none", border:"none", cursor:globalIdx===links.length-1?"default":"pointer", color:globalIdx===links.length-1?T.border:T.muted, fontSize:13, padding:"1px 4px" }}>▼</button>
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, color:T.text, fontSize:14 }}>{link.label}</div>
              {link.description && <div style={{ color:T.sub, fontSize:12, marginTop:2 }}>{link.description}</div>}
              <div style={{ color:T.muted, fontSize:11, marginTop:2, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{link.url}</div>
            </div>
            <div style={{ display:"flex", gap:6, flexShrink:0 }}>
              <label style={{ background:"#EDE9FE", border:"1px solid #C4B5FD", borderRadius:7, padding:"6px 10px", color:"#7C3AED", fontSize:11, cursor:"pointer", fontFamily:"'Syne',sans-serif", fontWeight:600 }}>
                {link.qr?"↑ QR":"+ QR"}
                <input type="file" accept="image/*" style={{ display:"none" }} onChange={e=>e.target.files[0]&&handleQR(link.id,e.target.files[0])}/>
              </label>
              <button onClick={()=>openEdit(link)} style={{ background:T.bg, border:`1px solid ${T.border}`, borderRadius:7, padding:"6px 10px", color:T.sub, fontSize:11, cursor:"pointer" }}>Modifier</button>
              <button onClick={()=>setConfirmDel(link.id)} style={{ background:"#FEF2F2", border:"1px solid #FECACA", borderRadius:7, padding:"6px 8px", color:"#EF4444", fontSize:11, cursor:"pointer" }}>🗑</button>
            </div>
          </div>
        ))}
        {links.length===0 && <div style={{ textAlign:"center", color:T.muted, padding:40, fontFamily:"'Syne',sans-serif" }}>Aucun lien</div>}
      </div>
    </div>
  );
}


export default function App() {
  const [sellers,setSellers]=useState([]);
  const [offers,setOffers]=useState([]);
  const [seller,setSeller]=useState(null);
  const [view,setView]=useState("sales");
  const [adminAuth,setAdminAuth]=useState(false);
  const [adminTab,setAdminTab]=useState("offers");
  const [loading,setLoading]=useState(true);

  const loadSellers=useCallback(async()=>{
    const {data}=await sb.from("sellers").select("*").eq("active",true).order("sort_order");
    if(data) setSellers(data);
  },[]);
  const loadOffers=useCallback(async()=>{
    const {data}=await sb.from("offers").select("*").order("sort_order");
    if(data) setOffers(data);
  },[]);
  const loadAll=useCallback(async()=>{
    await Promise.all([loadSellers(),loadOffers()]);
    setLoading(false);
  },[loadSellers,loadOffers]);

  useEffect(()=>{ loadAll(); },[loadAll]);

  if (loading) return (
    <div style={{ minHeight:"100vh", background:T.bg, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Syne',sans-serif" }}>
      <div style={{ color:T.sub, fontSize:15 }}>Chargement…</div>
    </div>
  );

  if (view==="admin") {
    if (!adminAuth) return <AdminLogin onSuccess={()=>setAdminAuth(true)} onBack={()=>setView("sales")}/>;
    return (
      <div style={{ minHeight:"100vh", background:T.bg, fontFamily:"'Syne',sans-serif" }}>
        <NavBar
          center={
            <div style={{ display:"flex", gap:4, background:T.bg, borderRadius:10, padding:4 }}>
              {[["offers","📋 Offres"],["sellers","👥 Vendeurs"],["sales","📊 Ventes"],["links","🔗 Liens"]].map(([t,label])=>(
                <button key={t} onClick={()=>setAdminTab(t)} style={{ background:adminTab===t?"#059669":"transparent", border:"none", borderRadius:7, padding:"7px 12px", color:adminTab===t?"#fff":T.sub, fontWeight:700, fontSize:12, cursor:"pointer", fontFamily:"'Syne',sans-serif" }}>{label}</button>
              ))}
            </div>
          }
          right={
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ color:"#7C3AED", fontSize:11, fontWeight:700, background:"#EDE9FE", border:"1px solid #C4B5FD", borderRadius:6, padding:"2px 8px" }}>ADMIN</span>
              <button onClick={()=>{ setAdminAuth(false); setView("sales"); }} style={btnGhost}>Quitter</button>
            </div>
          }
        />
        {adminTab==="offers"  && <AdminOffers  offers={offers}  reload={loadOffers}/>}
        {adminTab==="sellers" && <AdminSellers sellers={sellers} reload={loadSellers}/>}
        {adminTab==="sales"   && <AdminSales   sellers={sellers}/>}
        {adminTab==="links"   && <AdminLinks/>}
      </div>
    );
  }

  if (!seller) return (
    <div>
      <SellerPicker sellers={sellers} onSelect={setSeller}/>
      <button onClick={()=>setView("admin")} style={{ position:"fixed", bottom:24, right:24, ...btnGhost, boxShadow:"0 2px 8px rgba(0,0,0,0.1)" }}>⚙️ Admin</button>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", background:T.bg, fontFamily:"'Syne',sans-serif" }}>
      <NavBar
        right={
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ width:30, height:30, borderRadius:8, background:"#D1FAE5", border:"1px solid #6EE7B7", display:"flex", alignItems:"center", justifyContent:"center", color:"#059669", fontWeight:900, fontSize:12 }}>{initials(seller.name)}</div>
            <span style={{ color:T.text, fontWeight:700, fontSize:14 }}>{seller.name}</span>
            <button onClick={()=>setSeller(null)} style={{ background:"none", border:"none", color:T.muted, cursor:"pointer", fontFamily:"'Syne',sans-serif", fontSize:12 }}>Changer</button>
          </div>
        }
      />
      <SalesView offers={offers} seller={seller}/>
      <button onClick={()=>setView("admin")} style={{ position:"fixed", bottom:20, right:20, ...btnGhost, fontSize:11, boxShadow:"0 2px 8px rgba(0,0,0,0.1)" }}>⚙️</button>
    </div>
  );
}
