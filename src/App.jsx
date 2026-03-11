import { useState, useRef, useEffect } from "react";

/* ═══════════════════════════════════════════════════════════
   THEMES
═══════════════════════════════════════════════════════════ */
const THEMES = {
  dark: {
    name:"Dark", icon:"🌑",
    bg:"#09090f", card:"#111118", el:"#18181f", inp:"#1e1e28",
    border:"#26263a", bFocus:"#e8002d",
    text:"#f0f0f8", muted:"#44445a", sub:"#7777aa",
    accent:"#e8002d", aSoft:"rgba(232,0,45,0.12)",
    gold:"#ffd700", silver:"#aaaacc", bronze:"#c07840",
    grad:"linear-gradient(135deg,#e8002d 0%,#ff5533 100%)",
    glow:"0 0 32px rgba(232,0,45,0.3)",
    shadow:"0 8px 40px rgba(0,0,0,0.7)",
    nav:"rgba(9,9,15,0.98)",
  },
  light: {
    name:"Light", icon:"☀️",
    bg:"#f2f2f8", card:"#ffffff", el:"#f0f0f8", inp:"#e8e8f4",
    border:"#d0d0e8", bFocus:"#e8002d",
    text:"#080818", muted:"#9898b8", sub:"#555578",
    accent:"#e8002d", aSoft:"rgba(232,0,45,0.08)",
    gold:"#aa8800", silver:"#666688", bronze:"#9a5830",
    grad:"linear-gradient(135deg,#e8002d 0%,#ff5533 100%)",
    glow:"0 0 32px rgba(232,0,45,0.15)",
    shadow:"0 8px 40px rgba(0,0,0,0.12)",
    nav:"rgba(255,255,255,0.98)",
  },
  midnight: {
    name:"Midnight", icon:"🌌",
    bg:"#03050f", card:"#07091a", el:"#0c0f28", inp:"#0a0d22",
    border:"#111530", bFocus:"#4d88ff",
    text:"#d8e4ff", muted:"#303870", sub:"#5566aa",
    accent:"#4d88ff", aSoft:"rgba(77,136,255,0.12)",
    gold:"#ffd700", silver:"#8899cc", bronze:"#667799",
    grad:"linear-gradient(135deg,#4d88ff 0%,#00ddff 100%)",
    glow:"0 0 32px rgba(77,136,255,0.3)",
    shadow:"0 8px 40px rgba(0,0,0,0.7)",
    nav:"rgba(3,5,15,0.98)",
  },
};

/* ═══════════════════════════════════════════════════════════
   CONSTANTS
═══════════════════════════════════════════════════════════ */
const INVITE_CODES = { "ADMIN-OT25":"admin", "PILOTE-OT25":"pilote" };
const FLAGS = ["🇫🇷","🇬🇧","🇩🇪","🇮🇹","🇪🇸","🇧🇷","🇳🇱","🇲🇨","🇧🇪","🇦🇺","🇨🇦","🇯🇵","🇺🇸","🇦🇹","🇵🇹","🇨🇭","🇲🇽","🇷🇺","🇨🇳","🇦🇷"];
const AV_COLORS = ["#e8002d","#3671C6","#FF8000","#27F4D2","#358C75","#6b8aff","#ff6b35","#00ccff","#ffd700","#cc44cc","#ff4488","#44ffaa"];
const POST_TAGS = { "Race Day":"#e8002d","Training":"#00aa44","Podium":"#6b8aff","Victory":"#ffd700","Qualifying":"#ff8000","Fun":"#cc44cc" };

/* ═══════════════════════════════════════════════════════════
   SEED DATA
═══════════════════════════════════════════════════════════ */
const SEED_USERS = [
  { id:1, pseudo:"Admin_OverTake", password:"admin123", role:"admin",   firstName:"",       lastName:"",           num:null, team:null,             nat:"🇫🇷", color:"#e8002d", av:"OT", bio:"Administrateur officiel OverTake 🏎️", joined:"Janv. 2025", avatar:null },
  { id:2, pseudo:"Max_Verstappen", password:"pass123",  role:"pilote",  firstName:"Max",    lastName:"Verstappen", num:1,    team:"Red Bull Racing", nat:"🇳🇱", color:"#3671C6", av:"MV", bio:"Triple Champion du Monde 🏆 | Red Bull", joined:"Janv. 2025", avatar:null },
  { id:3, pseudo:"Lewis_Hamilton", password:"pass123",  role:"pilote",  firstName:"Lewis",  lastName:"Hamilton",   num:44,   team:"Ferrari",         nat:"🇬🇧", color:"#E8002D", av:"LH", bio:"7× Champion. Forza Ferrari 🔴", joined:"Fév. 2025", avatar:null },
  { id:4, pseudo:"Lando_Norris",   password:"pass123",  role:"pilote",  firstName:"Lando",  lastName:"Norris",     num:4,    team:"McLaren",         nat:"🇬🇧", color:"#FF8000", av:"LN", bio:"Papaya forever 🧡 | McLaren Racing", joined:"Fév. 2025", avatar:null },
  { id:5, pseudo:"Charles_Leclerc",password:"pass123",  role:"pilote",  firstName:"Charles",lastName:"Leclerc",    num:16,   team:"Ferrari",         nat:"🇲🇨", color:"#E8002D", av:"CL", bio:"Monaco boy 🇲🇨 | Scuderia Ferrari", joined:"Mars 2025", avatar:null },
  { id:6, pseudo:"Spectateur",     password:"viewer1",  role:"spectateur",firstName:"",    lastName:"",           num:null, team:null,              nat:"🏳️", color:"#6677aa", av:"SP", bio:"Fan de F1 🏁", joined:"Mars 2025", avatar:null },
];
const SEED_RACES = [
  { id:1, name:"GP de Bahreïn", circuit:"Sakhir", date:"2 Mars 2025", round:1, cat:"F1", flag:"🇧🇭", by:"Admin_OverTake", at:"Il y a 3j",
    results:[{pos:1,driver:"Max Verstappen",team:"Red Bull Racing",gap:"1:30:55.554",pts:25,fl:false},{pos:2,driver:"Charles Leclerc",team:"Ferrari",gap:"+6.490s",pts:18,fl:false},{pos:3,driver:"Lando Norris",team:"McLaren",gap:"+9.227s",pts:15,fl:true},{pos:4,driver:"Lewis Hamilton",team:"Ferrari",gap:"+14.876s",pts:12,fl:false},{pos:5,driver:"Carlos Sainz",team:"Williams",gap:"+21.454s",pts:10,fl:false},{pos:6,driver:"George Russell",team:"Mercedes",gap:"+28.1s",pts:8,fl:false}]},
  { id:2, name:"GP d'Arabie Saoudite", circuit:"Jeddah", date:"9 Mars 2025", round:2, cat:"F1", flag:"🇸🇦", by:"Admin_OverTake", at:"Il y a 1j",
    results:[{pos:1,driver:"Lewis Hamilton",team:"Ferrari",gap:"1:21:14.894",pts:25,fl:false},{pos:2,driver:"Max Verstappen",team:"Red Bull Racing",gap:"+2.119s",pts:18,fl:true},{pos:3,driver:"Oscar Piastri",team:"McLaren",gap:"+8.453s",pts:15,fl:false},{pos:4,driver:"Lando Norris",team:"McLaren",gap:"+12.2s",pts:12,fl:false},{pos:5,driver:"Charles Leclerc",team:"Ferrari",gap:"+19.8s",pts:10,fl:false}]},
];
const SEED_POSTS = [
  { id:1, authorId:2, pseudo:"Max_Verstappen", av:"MV", color:"#3671C6", team:"Red Bull Racing", num:1, time:"2h", tag:"Race Day", tagColor:"#e8002d", text:"Victoire à Bahreïn ! 🏆 La voiture était parfaite. Merci à toute l'équipe ! 💪", image:null, likes:[3,4,5], comments:[{id:1,authorId:4,pseudo:"Lando_Norris",text:"Belle course ! 🧡",time:"1h"}], reported:false, mentions:[] },
  { id:2, authorId:3, pseudo:"Lewis_Hamilton", av:"LH", color:"#E8002D", team:"Ferrari", num:44, time:"5h", tag:"Victory", tagColor:"#ffd700", text:"Premier podium avec Ferrari ❤️ Ce moment... Forza Ferrari ! @Charles_Leclerc on continue comme ça !", image:null, likes:[2,4,5,6], comments:[], reported:false, mentions:[5] },
  { id:3, authorId:4, pseudo:"Lando_Norris", av:"LN", color:"#FF8000", team:"McLaren", num:4, time:"1j", tag:"Training", tagColor:"#00aa44", text:"Session de sim aujourd'hui 🎮 On prépare Melbourne ! @Max_Verstappen attention on arrive 😄", image:null, likes:[2,3], comments:[], reported:false, mentions:[2] },
];
const SEED_ANNS = [
  { id:1, title:"Calendrier 2025 disponible !", body:"18 courses au programme cette saison. Le calendrier complet est maintenant publié !", author:"Admin_OverTake", time:"Il y a 2j", pinned:true, readBy:[] },
  { id:2, title:"Bienvenue sur OverTake ! 🏎️", body:"La plateforme officielle de notre communauté F1/F2 est en ligne !", author:"Admin_OverTake", time:"Il y a 5j", pinned:false, readBy:[] },
];
const SEED_MSGS = [
  { id:1, type:"dm", participants:[2,3], name:"", messages:[{id:1,from:2,text:"Alors, prêt pour Bahreïn ?",time:"10:30"},{id:2,from:3,text:"Ferrari est au top cette année 🔴",time:"10:32"}] },
  { id:2, type:"group", participants:[2,3,4], name:"Top 3 Bahreïn 🏆", messages:[{id:1,from:2,text:"Belle course les gars !",time:"18:00"},{id:2,from:4,text:"FL pour moi c'est déjà ça 🧡",time:"18:01"}] },
];
const SEED_NOTIFS = [
  { id:1, type:"mention", from:"Lewis_Hamilton", text:"t'a mentionné", time:"5h", read:false, targetId:5 },
  { id:2, type:"like", from:"Lando_Norris", text:"a aimé ta publication", time:"2h", read:false, targetId:2 },
  { id:3, type:"announce", from:"Admin_OverTake", text:"Nouvelle annonce : Calendrier 2025 !", time:"2j", read:true, targetId:null },
];
const WDC = [
  {id:1,name:"Max Verstappen",  short:"Verstappen",team:"Red Bull Racing",num:1, nat:"🇳🇱",pts:43,color:"#3671C6"},
  {id:2,name:"Lewis Hamilton",  short:"Hamilton",  team:"Ferrari",        num:44,nat:"🇬🇧",pts:37,color:"#E8002D"},
  {id:3,name:"Charles Leclerc",short:"Leclerc",   team:"Ferrari",        num:16,nat:"🇲🇨",pts:28,color:"#E8002D"},
  {id:4,name:"Lando Norris",   short:"Norris",    team:"McLaren",        num:4, nat:"🇬🇧",pts:27,color:"#FF8000"},
  {id:5,name:"Oscar Piastri",  short:"Piastri",   team:"McLaren",        num:81,nat:"🇦🇺",pts:15,color:"#FF8000"},
  {id:6,name:"Carlos Sainz",   short:"Sainz",     team:"Williams",       num:55,nat:"🇪🇸",pts:10,color:"#64C4FF"},
  {id:7,name:"George Russell",  short:"Russell",   team:"Mercedes",       num:63,nat:"🇬🇧",pts:8, color:"#27F4D2"},
  {id:8,name:"Fernando Alonso",short:"Alonso",    team:"Aston Martin",   num:14,nat:"🇪🇸",pts:4, color:"#358C75"},
];
const WCC = [
  {team:"Ferrari",        color:"#E8002D",pts:65},
  {team:"Red Bull Racing",color:"#3671C6",pts:61},
  {team:"McLaren",        color:"#FF8000",pts:42},
  {team:"Williams",       color:"#64C4FF",pts:10},
  {team:"Mercedes",       color:"#27F4D2",pts:8},
  {team:"Aston Martin",   color:"#358C75",pts:4},
];

/* ═══════════════════════════════════════════════════════════
   TIRE SVG
═══════════════════════════════════════════════════════════ */
function Tire({ color, size=24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" style={{flexShrink:0}}>
      <circle cx="16" cy="16" r="14" fill="#111" stroke="#333" strokeWidth="1.5"/>
      {[0,45,90,135,180,225,270,315].map((a,i)=>{const r=a*Math.PI/180;return<line key={i} x1={16+10*Math.cos(r)} y1={16+10*Math.sin(r)} x2={16+13.5*Math.cos(r)} y2={16+13.5*Math.sin(r)} stroke="#444" strokeWidth="2.5" strokeLinecap="round"/>})}
      <circle cx="16" cy="16" r="8" fill="#1a1a1a" stroke="#333" strokeWidth="1"/>
      <circle cx="16" cy="16" r="5" fill={color}/>
      {[0,60,120,180,240,300].map((a,i)=>{const r=a*Math.PI/180;return<line key={i} x1={16+2*Math.cos(r)} y1={16+2*Math.sin(r)} x2={16+6.5*Math.cos(r)} y2={16+6.5*Math.sin(r)} stroke="#333" strokeWidth="1"/>})}
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════
   ATOMS
═══════════════════════════════════════════════════════════ */
function Av({ src, letter, color, size=40, style={} }) {
  if (src) return <img src={src} alt="" style={{width:size,height:size,borderRadius:size*0.3,border:`2px solid ${color}`,objectFit:"cover",flexShrink:0,...style}}/>;
  return (
    <div style={{width:size,height:size,borderRadius:size*0.3,background:color+"22",border:`2px solid ${color}`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:size*0.34,color,flexShrink:0,userSelect:"none",...style}}>
      {letter}
    </div>
  );
}
function Chip({ label, color }) {
  return <span style={{background:color+"20",border:`1px solid ${color}44`,borderRadius:20,padding:"3px 9px",fontSize:11,fontWeight:700,color,flexShrink:0}}>{label}</span>;
}
function RolePill({ role, t }) {
  const m={admin:["👑 Admin",t.accent],pilote:["🏎️ Pilote","#6b8aff"],spectateur:["👁️ Spectateur","#6677aa"]};
  const[l,c]=m[role]||["?","#888"];
  return <Chip label={l} color={c}/>;
}
function Btn({ children, onClick, variant="primary", disabled=false, style={}, t, full=false }) {
  const v={
    primary:{background:t.grad,color:"#fff",border:"none",boxShadow:disabled?"none":t.glow},
    secondary:{background:t.el,color:t.text,border:`1px solid ${t.border}`},
    ghost:{background:"transparent",color:t.muted,border:`1px solid ${t.border}`},
    danger:{background:"rgba(192,0,0,0.9)",color:"#fff",border:"none"},
  };
  return (
    <button onClick={onClick} disabled={disabled} style={{...v[variant],borderRadius:12,cursor:disabled?"not-allowed":"pointer",fontWeight:700,opacity:disabled?0.4:1,display:"inline-flex",alignItems:"center",justifyContent:"center",gap:6,padding:"11px 18px",fontSize:14,width:full?"100%":"auto",minHeight:44,...style}}>
      {children}
    </button>
  );
}
function Inp({ label, type="text", value, onChange, placeholder, icon, error, t, children, multi, rows=3 }) {
  const[f,setF]=useState(false);
  const base={width:"100%",boxSizing:"border-box",padding:`13px ${icon?"42px":"14px"}`,background:t.inp,border:`1.5px solid ${f?t.bFocus:error?"#c04040":t.border}`,borderRadius:12,color:t.text,fontSize:16,outline:"none",fontFamily:"inherit",transition:"border-color .15s",minHeight:multi?"80px":"auto"};
  return (
    <div style={{marginBottom:14}}>
      {label&&<div style={{fontSize:11,fontWeight:700,color:t.sub,marginBottom:6,letterSpacing:"0.8px"}}>{label}</div>}
      {children?children:(
        <div style={{position:"relative"}}>
          {icon&&<span style={{position:"absolute",left:13,top:"50%",transform:"translateY(-50%)",fontSize:18,pointerEvents:"none",zIndex:1}}>{icon}</span>}
          {multi
            ?<textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} onFocus={()=>setF(true)} onBlur={()=>setF(false)} rows={rows} style={{...base,resize:"vertical"}}/>
            :<input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} onFocus={()=>setF(true)} onBlur={()=>setF(false)} style={base}/>
          }
        </div>
      )}
      {error&&<div style={{fontSize:12,color:"#f06060",marginTop:4}}>⚠ {error}</div>}
    </div>
  );
}

const posColor=(pos,t)=>pos===1?t.gold:pos===2?t.silver:pos===3?t.bronze:t.muted;
const posIcon=pos=>pos===1?"🥇":pos===2?"🥈":pos===3?"🥉":pos;

/* ═══════════════════════════════════════════════════════════
   LOGO
═══════════════════════════════════════════════════════════ */
function Logo({ size=36 }) {
  return (
    <div style={{display:"flex",alignItems:"center",gap:9,flexShrink:0}}>
      <div style={{width:size,height:size,borderRadius:size*0.28,background:"#fff",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",flexShrink:0,boxShadow:"0 2px 12px rgba(0,0,0,0.5)"}}>
        <img src="./logo.png" alt="OT" style={{width:"88%",height:"88%",objectFit:"contain"}}
          onError={e=>{e.target.style.display="none";e.target.parentElement.innerHTML="<span style='font-size:18px'>🏎️</span>";}}/>
      </div>
      <div>
        <div style={{fontSize:size*0.47,fontWeight:900,color:"#f5f5f5",letterSpacing:"-0.5px",lineHeight:1,fontStyle:"italic"}}><span style={{color:"#e8002d"}}>Over</span>Take</div>
        <div style={{fontSize:size*0.22,color:"#666",letterSpacing:"1.5px",fontWeight:700,lineHeight:1}}>F1 TRACKING</div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   TOP BAR (mobile)
═══════════════════════════════════════════════════════════ */
function TopBar({ title, t, right, onBack, backLabel }) {
  return (
    <div style={{position:"sticky",top:0,zIndex:100,background:t.nav,backdropFilter:"blur(20px)",borderBottom:`1px solid ${t.border}`,padding:"env(safe-area-inset-top,0) 16px 0",paddingBottom:0}}>
      <div style={{height:56,display:"flex",alignItems:"center",gap:10}}>
        {onBack
          ? <button onClick={onBack} style={{background:"none",border:"none",cursor:"pointer",color:t.accent,fontSize:14,fontWeight:700,display:"flex",alignItems:"center",gap:4,flexShrink:0,padding:"4px 0",minWidth:44,minHeight:44}}>‹ {backLabel||"Retour"}</button>
          : <Logo size={30}/>
        }
        <div style={{flex:1,textAlign:onBack?"center":"left",fontWeight:900,color:t.text,fontSize:17,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",marginRight:onBack?44:0}}>{onBack?title:""}</div>
        {right||null}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   BOTTOM NAV BAR (mobile)
═══════════════════════════════════════════════════════════ */
function BottomNav({ tab, setTab, user, unread, notifCount, msgCount, t, onMenuOpen }) {
  const items = [
    { id:"home",     icon:"🏠", label:"Accueil" },
    { id:"social",   icon:"📸", label:"Réseau" },
    { id:"results",  icon:"📊", label:"Résultats" },
    { id:"messages", icon:"💬", label:"Messages", badge:msgCount },
    { id:"more",     icon:null,  label:"Menu",  isTire:true },
  ];
  return (
    <div style={{position:"fixed",bottom:0,left:0,right:0,zIndex:200,background:t.nav,backdropFilter:"blur(20px)",borderTop:`1px solid ${t.border}`,paddingBottom:"env(safe-area-inset-bottom,0)",display:"flex"}}>
      {items.map(item=>{
        const active = tab===item.id;
        const showBadge = (item.id==="messages"&&msgCount>0)||(item.id==="home"&&(notifCount>0||unread>0));
        return (
          <button key={item.id} onClick={()=>item.isTire?onMenuOpen():setTab(item.id)}
            style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:3,padding:"10px 0 8px",background:"none",border:"none",cursor:"pointer",position:"relative",minHeight:56}}>
            <div style={{position:"relative"}}>
              {item.isTire
                ? <div style={{display:"flex",gap:1}}><Tire color="#e8002d" size={9}/><Tire color="#ffd700" size={9}/><Tire color="#f0f0f0" size={9}/></div>
                : <span style={{fontSize:22,lineHeight:1,filter:active?"drop-shadow(0 0 6px currentColor)":"none"}}>{item.icon}</span>
              }
              {showBadge&&<div style={{position:"absolute",top:-3,right:-5,width:8,height:8,background:t.accent,borderRadius:"50%"}}/>}
            </div>
            <span style={{fontSize:10,fontWeight:active?700:500,color:active?t.accent:t.muted,letterSpacing:"0.2px"}}>{item.label}</span>
            {active&&<div style={{position:"absolute",top:0,left:"20%",right:"20%",height:2,background:t.accent,borderRadius:"0 0 2px 2px"}}/>}
          </button>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SIDE DRAWER
═══════════════════════════════════════════════════════════ */
function Drawer({ open, onClose, user, tab, setTab, theme, setTheme, unread, notifCount, t }) {
  const items = [
    {id:"home",       icon:"🏠", label:"Accueil"},
    {id:"social",     icon:"📸", label:"Réseau Pilotes"},
    {id:"results",    icon:"📊", label:"Résultats"},
    {id:"standings",  icon:"🏆", label:"Classements"},
    {id:"announcements",icon:"📢",label:"Annonces", badge:unread},
    {id:"notifications",icon:"🔔",label:"Notifications", badge:notifCount},
    {id:"messages",   icon:"💬", label:"Messages"},
    ...(user?.role==="admin"?[{id:"admin",icon:"👑",label:"Admin"}]:[]),
    {id:"profile",    icon:"👤", label:"Mon Profil"},
  ];
  return (
    <>
      {open&&<div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",zIndex:300,backdropFilter:"blur(4px)"}} />}
      <div style={{position:"fixed",top:0,right:0,bottom:0,width:"min(320px,90vw)",background:t.card,borderLeft:`1px solid ${t.border}`,zIndex:400,transform:open?"translateX(0)":"translateX(100%)",transition:"transform 0.28s cubic-bezier(0.4,0,0.2,1)",display:"flex",flexDirection:"column",paddingTop:"env(safe-area-inset-top,0)",paddingBottom:"env(safe-area-inset-bottom,0)",boxShadow:open?"-12px 0 60px rgba(0,0,0,0.6)":"none"}}>
        {/* Header */}
        <div style={{padding:"16px 16px 12px",borderBottom:`1px solid ${t.border}`,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <Logo size={30}/>
          <button onClick={onClose} style={{background:t.el,border:`1px solid ${t.border}`,borderRadius:10,width:36,height:36,cursor:"pointer",color:t.muted,fontSize:20,display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
        </div>
        {/* User */}
        {user&&(
          <div style={{padding:"14px 16px",borderBottom:`1px solid ${t.border}`,display:"flex",alignItems:"center",gap:12}}>
            <Av src={user.avatar} letter={user.av} color={user.color} size={46}/>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontWeight:800,color:t.text,fontSize:15,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{user.pseudo}</div>
              <div style={{marginTop:3}}><RolePill role={user.role} t={t}/></div>
            </div>
          </div>
        )}
        {/* Nav */}
        <div style={{flex:1,overflowY:"auto",padding:"8px"}}>
          {items.map(item=>(
            <button key={item.id} onClick={()=>{setTab(item.id);onClose();}}
              style={{width:"100%",display:"flex",alignItems:"center",gap:13,padding:"13px 12px",borderRadius:12,border:"none",cursor:"pointer",background:tab===item.id?t.accent+"22":"transparent",color:tab===item.id?t.accent:t.text,fontWeight:tab===item.id?700:500,fontSize:15,textAlign:"left",marginBottom:2,position:"relative",minHeight:48}}>
              <span style={{fontSize:20}}>{item.icon}</span>
              {item.label}
              {item.badge>0&&<span style={{marginLeft:"auto",background:t.accent,color:"#fff",borderRadius:20,fontSize:11,fontWeight:800,padding:"2px 8px"}}>{item.badge}</span>}
              {tab===item.id&&<div style={{position:"absolute",left:0,top:"15%",bottom:"15%",width:3,background:t.accent,borderRadius:"0 3px 3px 0"}}/>}
            </button>
          ))}
        </div>
        {/* Theme */}
        <div style={{padding:"12px 16px",borderTop:`1px solid ${t.border}`}}>
          <div style={{fontSize:11,fontWeight:700,color:t.muted,marginBottom:9,letterSpacing:"1px"}}>THÈME</div>
          <div style={{display:"flex",gap:8}}>
            {Object.entries(THEMES).map(([k,th])=>(
              <button key={k} onClick={()=>setTheme(k)} style={{flex:1,padding:"9px 0",borderRadius:10,border:`1.5px solid ${theme===k?t.accent:t.border}`,background:theme===k?t.accent+"22":"transparent",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:3,minHeight:44}}>
                <span style={{fontSize:17}}>{th.icon}</span>
                <span style={{fontSize:10,fontWeight:700,color:theme===k?t.accent:t.muted}}>{th.name}</span>
              </button>
            ))}
          </div>
        </div>
        <button onClick={()=>window.location.reload()} style={{margin:"0 14px 14px",padding:"13px",borderRadius:12,border:"1px solid #c0404044",background:"rgba(192,64,64,0.1)",color:"#f06060",fontWeight:700,cursor:"pointer",fontSize:14,minHeight:44}}>
          🚪 Déconnexion
        </button>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   AUTH SCREEN
═══════════════════════════════════════════════════════════ */
function AuthScreen({ onLogin, t }) {
  const[step,setStep]=useState("login");
  const[role,setRole]=useState(null);
  const[code,setCode]=useState(""); const[codeErr,setCodeErr]=useState("");
  const[li,setLi]=useState({pseudo:"",password:""}); const[liErr,setLiErr]=useState("");
  const[reg,setReg]=useState({pseudo:"",password:"",confirm:"",firstName:"",lastName:"",num:"",team:"",nat:"🇫🇷"});
  const[regErr,setRegErr]=useState({});
  const[users,setUsers]=useState(SEED_USERS);

  const doCode=()=>{const r=INVITE_CODES[code.trim().toUpperCase()];if(r){setRole(r);setCodeErr("");setStep("register");}else setCodeErr("Code invalide — contacte un admin.");};
  const doLogin=()=>{const u=users.find(x=>x.pseudo.toLowerCase()===li.pseudo.trim().toLowerCase()&&x.password===li.password);if(u)onLogin(u);else setLiErr("Identifiant ou mot de passe incorrect.");};
  const doReg=()=>{
    const e={};
    if(!reg.pseudo.trim())e.pseudo="Requis";
    if(reg.password.length<6)e.password="Min. 6 caractères";
    if(reg.password!==reg.confirm)e.confirm="Ne correspond pas";
    if(users.find(u=>u.pseudo.toLowerCase()===reg.pseudo.trim().toLowerCase()))e.pseudo="Pseudo déjà pris";
    if(role==="pilote"){if(!reg.firstName.trim())e.firstName="Requis";if(!reg.lastName.trim())e.lastName="Requis";}
    if(Object.keys(e).length){setRegErr(e);return;}
    const nu={id:Date.now(),pseudo:reg.pseudo.trim(),password:reg.password,role,firstName:reg.firstName.trim(),lastName:reg.lastName.trim(),num:reg.num?parseInt(reg.num):null,team:reg.team.trim()||"Sans équipe",nat:reg.nat,color:AV_COLORS[users.length%AV_COLORS.length],av:reg.pseudo.slice(0,2).toUpperCase(),bio:"",joined:"Mars 2025",avatar:null};
    setUsers([...users,nu]);onLogin(nu);
  };

  return (
    <div style={{minHeight:"100dvh",background:t.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"env(safe-area-inset-top,20px) 20px env(safe-area-inset-bottom,20px)",overflowY:"auto"}}>
      {/* Logo */}
      <div style={{textAlign:"center",marginBottom:28}}>
        <div style={{width:96,height:96,background:"#fff",borderRadius:24,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px",boxShadow:"0 8px 40px rgba(232,0,45,0.3)",overflow:"hidden"}}>
          <img src="./logo.png" alt="OverTake" style={{width:"85%",height:"85%",objectFit:"contain"}} onError={e=>{e.target.style.display="none";e.target.parentElement.innerHTML="<span style='font-size:42px'>🏎️</span>";}}/>
        </div>
        <div style={{fontSize:30,fontWeight:900,color:t.text,letterSpacing:"-0.5px",fontStyle:"italic"}}><span style={{color:t.accent}}>Over</span>Take</div>
        <div style={{fontSize:11,color:t.muted,letterSpacing:"3px",fontWeight:700,marginTop:3}}>F1 TRACKING</div>
      </div>

      <div style={{width:"100%",maxWidth:440,background:t.card,borderRadius:22,padding:"24px 20px",boxShadow:t.shadow,border:`1px solid ${t.border}`}}>
        {step==="login"&&<>
          <div style={{fontSize:22,fontWeight:900,color:t.text,marginBottom:4}}>Connexion</div>
          <div style={{fontSize:14,color:t.muted,marginBottom:22}}>Accède à OverTake 🏎️</div>
          <Inp label="IDENTIFIANT" value={li.pseudo} onChange={v=>setLi({...li,pseudo:v})} placeholder="ton_pseudo" icon="👤" t={t}/>
          <Inp label="MOT DE PASSE" type="password" value={li.password} onChange={v=>setLi({...li,password:v})} placeholder="••••••••" icon="🔒" t={t}/>
          {liErr&&<div style={{background:"rgba(192,0,0,0.1)",border:"1px solid rgba(192,0,0,0.3)",borderRadius:10,padding:"10px 14px",fontSize:13,color:"#f07070",marginBottom:14}}>⚠ {liErr}</div>}
          <Btn onClick={doLogin} t={t} full style={{marginBottom:14,fontSize:16}}>Se connecter</Btn>
          <div style={{textAlign:"center",fontSize:14,color:t.muted}}>
            Pas de compte ? <button onClick={()=>setStep("code")} style={{background:"none",border:"none",color:t.accent,fontWeight:700,cursor:"pointer",fontSize:14}}>Rejoindre</button>
          </div>
          <div style={{marginTop:18,background:t.el,borderRadius:12,padding:"12px 14px",border:`1px solid ${t.border}`}}>
            <div style={{fontSize:10,fontWeight:800,color:t.muted,marginBottom:8,letterSpacing:"1.5px"}}>🧪 COMPTES DÉMO</div>
            {[["Admin","Admin_OverTake","admin123"],["Pilote","Max_Verstappen","pass123"],["Spectateur","Spectateur","viewer1"]].map(([r,p,pw])=>(
              <button key={r} onClick={()=>{setLi({pseudo:p,password:pw});setLiErr("");}} style={{display:"flex",justifyContent:"space-between",width:"100%",textAlign:"left",background:t.card,border:`1px solid ${t.border}`,borderRadius:8,color:t.sub,cursor:"pointer",fontSize:12,padding:"8px 10px",fontFamily:"monospace",marginBottom:4}}>
                <span style={{fontWeight:700,color:t.text}}>{r}</span><span>{p}</span><span style={{color:t.muted}}>{pw}</span>
              </button>
            ))}
          </div>
        </>}

        {step==="code"&&<>
          <button onClick={()=>setStep("login")} style={{background:"none",border:"none",color:t.accent,cursor:"pointer",fontSize:14,marginBottom:16,padding:0,fontWeight:600}}>‹ Retour</button>
          <div style={{fontSize:22,fontWeight:900,color:t.text,marginBottom:4}}>Code d'invitation</div>
          <div style={{fontSize:14,color:t.muted,marginBottom:20}}>Fourni par un administrateur</div>
          <div style={{background:t.el,borderRadius:16,padding:"18px",marginBottom:18,border:`1px solid ${t.border}`,textAlign:"center"}}>
            <div style={{display:"flex",justifyContent:"center",gap:20,marginBottom:12}}>
              {[["#e8002d","SOFT"],["#ffd700","MED"],["#f0f0f0","HARD"]].map(([c,l])=>(
                <div key={l} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                  <Tire color={c} size={36}/><span style={{fontSize:9,fontWeight:800,color:c,letterSpacing:"0.5px"}}>{l}</span>
                </div>
              ))}
            </div>
            <div style={{fontSize:13,color:t.sub}}>Code <span style={{color:t.accent,fontWeight:700}}>ADMIN</span> ou <span style={{color:"#6b8aff",fontWeight:700}}>PILOTE</span> requis</div>
          </div>
          <Inp label="CODE D'INVITATION" value={code} onChange={v=>{setCode(v);setCodeErr("");}} placeholder="PILOTE-OT25" icon="🎫" error={codeErr} t={t}/>
          <Btn onClick={doCode} t={t} full disabled={!code.trim()}>Valider →</Btn>
        </>}

        {step==="register"&&<>
          <button onClick={()=>setStep("code")} style={{background:"none",border:"none",color:t.accent,cursor:"pointer",fontSize:14,marginBottom:14,padding:0,fontWeight:600}}>‹ Retour</button>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:4}}>
            <div style={{fontSize:20,fontWeight:900,color:t.text}}>Créer un compte</div>
            <RolePill role={role} t={t}/>
          </div>
          <div style={{fontSize:13,color:t.muted,marginBottom:18}}>{role==="admin"?"Administrateur 👑":"Pilote 🏎️"}</div>
          <Inp label="PSEUDO" value={reg.pseudo} onChange={v=>setReg({...reg,pseudo:v})} placeholder="Charles_Leclerc" icon="👤" error={regErr.pseudo} t={t}/>
          <Inp label="MOT DE PASSE" type="password" value={reg.password} onChange={v=>setReg({...reg,password:v})} placeholder="Min. 6 caractères" icon="🔒" error={regErr.password} t={t}/>
          <Inp label="CONFIRMER" type="password" value={reg.confirm} onChange={v=>setReg({...reg,confirm:v})} placeholder="Répéter" icon="🔒" error={regErr.confirm} t={t}/>
          {role==="pilote"&&(
            <div style={{background:t.el,borderRadius:14,padding:"14px",border:`1px solid ${t.border}`,marginBottom:14}}>
              <div style={{fontSize:11,fontWeight:800,color:t.accent,marginBottom:12,letterSpacing:"0.8px"}}>INFOS PILOTE 🏎️</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                <Inp label="PRÉNOM" value={reg.firstName} onChange={v=>setReg({...reg,firstName:v})} placeholder="Charles" error={regErr.firstName} t={t}/>
                <Inp label="NOM" value={reg.lastName} onChange={v=>setReg({...reg,lastName:v})} placeholder="Leclerc" error={regErr.lastName} t={t}/>
                <Inp label="N° COURSE" type="number" value={reg.num} onChange={v=>setReg({...reg,num:v})} placeholder="16" t={t}/>
                <Inp label="NATIONALITÉ" t={t}>
                  <select value={reg.nat} onChange={e=>setReg({...reg,nat:e.target.value})} style={{width:"100%",padding:"13px 12px",background:t.inp,border:`1.5px solid ${t.border}`,borderRadius:12,color:t.text,fontSize:20,outline:"none",cursor:"pointer",minHeight:48}}>
                    {FLAGS.map(f=><option key={f} value={f}>{f}</option>)}
                  </select>
                </Inp>
              </div>
              <Inp label="ÉCURIE / TEAM" value={reg.team} onChange={v=>setReg({...reg,team:v})} placeholder="Ferrari, McLaren…" icon="🏎️" t={t}/>
            </div>
          )}
          <Btn onClick={doReg} t={t} full style={{fontSize:16}}>Créer mon compte 🚀</Btn>
        </>}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   HOME PAGE
═══════════════════════════════════════════════════════════ */
function HomePage({ user, t, setTab, unread, notifCount, msgCount }) {
  const greet = user.role==="pilote"&&user.firstName ? `Bonjour, ${user.firstName} 👋` : `Bonjour, ${user.pseudo.split("_")[0]} 👋`;
  return (
    <div>
      <TopBar t={t}/>
      <div style={{padding:"14px 14px 0"}}>
        {/* Hero */}
        <div style={{background:t.card,borderRadius:20,padding:"22px 20px",marginBottom:14,border:`1px solid ${t.border}`,position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:-40,right:-40,width:160,height:160,background:t.accent+"0d",borderRadius:"50%",filter:"blur(40px)",pointerEvents:"none"}}/>
          <div style={{position:"relative"}}>
            <div style={{display:"inline-flex",alignItems:"center",gap:6,background:t.accent+"22",borderRadius:20,padding:"4px 12px",marginBottom:10,border:`1px solid ${t.accent}44`}}>
              <div style={{width:6,height:6,background:t.accent,borderRadius:"50%",animation:"pulse 2s infinite"}}/>
              <span style={{color:t.accent,fontSize:11,fontWeight:700,letterSpacing:"1.5px"}}>SAISON 2025 EN COURS</span>
            </div>
            <h1 style={{fontSize:24,fontWeight:900,color:t.text,margin:"0 0 6px",lineHeight:1.15,letterSpacing:"-0.5px"}}>{greet}</h1>
            <p style={{color:t.sub,fontSize:14,margin:"0 0 16px",lineHeight:1.6}}>
              {user.role==="admin"&&"Panneau Admin disponible 👑"}
              {user.role==="pilote"&&"Suis les résultats et publie sur le Réseau 🏁"}
              {user.role==="spectateur"&&"Suis la saison en temps réel 📺"}
            </p>
            <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
              {[{v:"2",l:"Courses",i:"🏁"},{v:String(unread),l:"Annonces",i:"📢"},{v:String(notifCount),l:"Notifs",i:"🔔"}].map(s=>(
                <div key={s.l} style={{background:t.bg,borderRadius:10,padding:"8px 13px",border:`1px solid ${t.border}`,display:"flex",alignItems:"center",gap:7}}>
                  <span style={{fontSize:18}}>{s.i}</span>
                  <div><div style={{fontSize:16,fontWeight:900,color:t.text,lineHeight:1}}>{s.v}</div><div style={{fontSize:10,color:t.muted,fontWeight:600}}>{s.l}</div></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Cards 2×2 */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
          {[{id:"results",icon:"📊",title:"Résultats",sub:"Par course",color:t.accent},{id:"standings",icon:"🏆",title:"Classements",sub:"WDC · WCC",color:t.gold},{id:"messages",icon:"💬",title:"Messages",sub:"Privés & Groupes",color:"#6b8aff"},{id:"announcements",icon:"📢",title:"Annonces",sub:unread>0?`${unread} non lue(s)`:"Officielles",color:"#00aa44"}].map(c=>(
            <button key={c.id} onClick={()=>setTab(c.id)} style={{background:t.card,borderRadius:16,padding:"16px 14px",border:`1px solid ${t.border}`,cursor:"pointer",textAlign:"left",display:"flex",flexDirection:"column",gap:8,minHeight:100,position:"relative"}}>
              <div style={{width:36,height:36,borderRadius:10,background:c.color+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>{c.icon}</div>
              <div style={{fontWeight:800,color:t.text,fontSize:14}}>{c.title}</div>
              <div style={{fontSize:11,color:t.muted,lineHeight:1.4}}>{c.sub}</div>
              {c.id==="announcements"&&unread>0&&<div style={{position:"absolute",top:10,right:10,background:t.accent,color:"#fff",borderRadius:10,fontSize:10,fontWeight:800,padding:"2px 6px"}}>{unread}</div>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   RESULTS
═══════════════════════════════════════════════════════════ */
function ResultsPage({ races, t }) {
  const[open,setOpen]=useState(null);
  const[cat,setCat]=useState("ALL");
  const list=races.filter(r=>cat==="ALL"||r.cat===cat);
  return (
    <div>
      <TopBar title="Résultats" t={t}/>
      <div style={{padding:"14px 14px 0"}}>
        <div style={{display:"flex",gap:8,marginBottom:14}}>
          {["ALL","F1","F2"].map(c=>(
            <button key={c} onClick={()=>setCat(c)} style={{padding:"9px 18px",borderRadius:10,border:`1px solid ${cat===c?t.accent:t.border}`,background:cat===c?t.accent:"transparent",color:cat===c?"#fff":t.muted,fontWeight:700,cursor:"pointer",fontSize:14,minHeight:44}}>
              {c}
            </button>
          ))}
        </div>
        {list.length===0&&<div style={{background:t.card,borderRadius:16,padding:40,textAlign:"center",border:`1px solid ${t.border}`}}><div style={{fontSize:32,marginBottom:10}}>🏁</div><div style={{color:t.muted}}>Aucun résultat</div></div>}
        {list.map(race=>{
          const isO=open===race.id; const cc=race.cat==="F1"?t.accent:"#6B8AFF";
          return (
            <div key={race.id} style={{background:t.card,borderRadius:16,overflow:"hidden",border:`1px solid ${isO?t.accent+"55":t.border}`,marginBottom:10,boxShadow:isO?t.glow:"none",transition:"all .2s"}}>
              <button onClick={()=>setOpen(isO?null:race.id)} style={{width:"100%",padding:"14px 16px",background:"transparent",border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:12,textAlign:"left",minHeight:72}}>
                <div style={{width:42,height:42,borderRadius:12,background:cc+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{race.flag}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",gap:6,marginBottom:3,alignItems:"center"}}>
                    <span style={{background:cc,color:"#fff",borderRadius:6,padding:"2px 8px",fontSize:11,fontWeight:800}}>{race.cat}</span>
                    <span style={{color:t.muted,fontSize:12}}>R{race.round} · {race.date}</span>
                  </div>
                  <div style={{fontWeight:800,color:t.text,fontSize:15,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{race.name}</div>
                </div>
                <div style={{textAlign:"right",flexShrink:0}}>
                  <div style={{fontSize:10,color:t.muted}}>Vainqueur</div>
                  <div style={{fontWeight:800,color:t.gold,fontSize:13}}>🥇 {race.results[0].driver.split(" ").pop()}</div>
                </div>
                <span style={{color:t.muted,fontSize:18,transform:isO?"rotate(180deg)":"none",transition:"transform .2s",flexShrink:0}}>⌄</span>
              </button>
              {isO&&(
                <div style={{borderTop:`1px solid ${t.border}`}}>
                  {race.results.map((r,i)=>(
                    <div key={i} style={{display:"grid",gridTemplateColumns:"36px 1fr 70px",gap:8,padding:"11px 16px",alignItems:"center",borderTop:i>0?`1px solid ${t.border}22`:"none",background:i%2===0?"transparent":t.el+"66"}}>
                      <div style={{fontWeight:900,color:posColor(r.pos,t),fontSize:14,textAlign:"center"}}>{posIcon(r.pos)}</div>
                      <div>
                        <div style={{fontWeight:700,color:t.text,fontSize:14}}>{r.driver}</div>
                        <div style={{fontSize:11,color:t.muted}}>{r.team}{r.fl?" · ⚡ FL":""}</div>
                      </div>
                      <div style={{textAlign:"right"}}>
                        <div style={{fontSize:12,color:t.muted,fontFamily:"monospace"}}>{r.pos===1?"":`+${r.pts}pt`}</div>
                        <div style={{fontWeight:900,fontSize:14,color:r.pts>=15?t.accent:t.text}}>+{r.pts}</div>
                      </div>
                    </div>
                  ))}
                  <div style={{padding:"8px 16px",borderTop:`1px solid ${t.border}`,fontSize:12,color:t.muted,display:"flex",gap:5}}>
                    <span>Posté par</span><span style={{color:t.accent,fontWeight:700}}>@{race.by}</span><span style={{marginLeft:"auto"}}>{race.at}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   STANDINGS
═══════════════════════════════════════════════════════════ */
function StandingsPage({ races, t }) {
  const[view,setView]=useState("wdc");
  const wdcLeader=WDC[0].pts;
  const wcc=[...WCC].sort((a,b)=>b.pts-a.pts);
  const wccLeader=wcc[0].pts;
  return (
    <div>
      <TopBar title="Classements" t={t}/>
      <div style={{padding:"14px 14px 0"}}>
        <div style={{display:"flex",gap:6,marginBottom:16,overflowX:"auto",paddingBottom:2}}>
          {[{id:"wdc",l:"🏆 Pilotes"},{id:"wcc",l:"🏭 Constructeurs"},{id:"race",l:"📊 Par Course"}].map(v=>(
            <button key={v.id} onClick={()=>setView(v.id)} style={{padding:"9px 16px",borderRadius:10,border:`1px solid ${view===v.id?t.accent:t.border}`,background:view===v.id?t.accent+"22":"transparent",color:view===v.id?t.accent:t.muted,fontWeight:700,cursor:"pointer",fontSize:13,whiteSpace:"nowrap",flexShrink:0,minHeight:44}}>
              {v.l}
            </button>
          ))}
        </div>

        {view==="wdc"&&WDC.map((d,i)=>(
          <div key={d.id} style={{background:t.card,borderRadius:14,padding:"12px 14px",border:`1px solid ${i<3?d.color+"44":t.border}`,marginBottom:8,display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:4,background:d.color,borderRadius:2,alignSelf:"stretch",flexShrink:0}}/>
            <div style={{width:26,textAlign:"center",fontWeight:900,fontSize:16,color:posColor(i+1,t),flexShrink:0}}>{i===0?"👑":i+1}</div>
            <div style={{width:34,height:34,borderRadius:9,background:d.color+"22",border:`1px solid ${d.color}44`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,color:d.color,fontSize:13,flexShrink:0}}>{d.num}</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:2}}>
                <span style={{fontWeight:800,color:t.text,fontSize:14,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{d.short}</span>
                <span style={{fontSize:14}}>{d.nat}</span>
              </div>
              <div style={{fontSize:11,color:t.muted,marginBottom:4}}>{d.team}</div>
              <div style={{height:3,background:t.border,borderRadius:2,overflow:"hidden"}}><div style={{height:"100%",width:`${(d.pts/wdcLeader)*100}%`,background:d.color,borderRadius:2,transition:"width .3s"}}/></div>
            </div>
            <div style={{textAlign:"right",flexShrink:0}}>
              <div style={{fontWeight:900,fontSize:20,color:i===0?t.accent:t.text}}>{d.pts}</div>
              <div style={{fontSize:10,color:t.muted,fontWeight:600}}>PTS</div>
              {i>0&&<div style={{fontSize:10,color:t.muted}}>-{wdcLeader-d.pts}</div>}
            </div>
          </div>
        ))}

        {view==="wcc"&&wcc.map((c,i)=>(
          <div key={c.team} style={{background:t.card,borderRadius:14,padding:"14px 16px",border:`1px solid ${i<3?c.color+"44":t.border}`,marginBottom:8,display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:4,background:c.color,borderRadius:2,alignSelf:"stretch",flexShrink:0}}/>
            <div style={{width:26,textAlign:"center",fontWeight:900,fontSize:16,color:posColor(i+1,t),flexShrink:0}}>{i===0?"👑":i+1}</div>
            <div style={{width:14,height:38,borderRadius:4,background:c.color,flexShrink:0}}/>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontWeight:800,color:t.text,fontSize:15,marginBottom:4,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.team}</div>
              <div style={{height:3,background:t.border,borderRadius:2,overflow:"hidden"}}><div style={{height:"100%",width:`${(c.pts/wccLeader)*100}%`,background:c.color,borderRadius:2}}/></div>
            </div>
            <div style={{textAlign:"right",flexShrink:0}}>
              <div style={{fontWeight:900,fontSize:20,color:i===0?t.accent:t.text}}>{c.pts}</div>
              <div style={{fontSize:10,color:t.muted,fontWeight:600}}>PTS</div>
            </div>
          </div>
        ))}

        {view==="race"&&(races.length===0
          ?<div style={{background:t.card,borderRadius:16,padding:36,textAlign:"center",border:`1px solid ${t.border}`}}><div style={{fontSize:30}}>🏁</div><div style={{color:t.muted,marginTop:8}}>Aucun résultat publié</div></div>
          :races.map(race=>(
            <div key={race.id} style={{background:t.card,borderRadius:16,marginBottom:12,border:`1px solid ${t.border}`,overflow:"hidden"}}>
              <div style={{padding:"12px 16px",borderBottom:`1px solid ${t.border}`,display:"flex",alignItems:"center",gap:10}}>
                <span style={{fontSize:22}}>{race.flag}</span>
                <div><div style={{fontWeight:800,color:t.text,fontSize:15}}>{race.name}</div><div style={{fontSize:12,color:t.muted}}>Round {race.round} · {race.date}</div></div>
              </div>
              {race.results.slice(0,5).map((r,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 16px",borderTop:i>0?`1px solid ${t.border}22`:"none"}}>
                  <div style={{width:28,fontWeight:900,color:posColor(r.pos,t),fontSize:14,textAlign:"center"}}>{posIcon(r.pos)}</div>
                  <div style={{flex:1}}><div style={{fontSize:14,fontWeight:700,color:t.text}}>{r.driver}</div><div style={{fontSize:11,color:t.muted}}>{r.team}</div></div>
                  <div style={{fontWeight:900,color:t.accent,fontSize:14}}>+{r.pts}</div>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SOCIAL
═══════════════════════════════════════════════════════════ */
function parseMentions(text, users) {
  const parts=[]; let last=0;
  const re=/@(\w+)/g; let m;
  while((m=re.exec(text))!==null){
    if(m.index>last)parts.push({type:"text",v:text.slice(last,m.index)});
    const u=users.find(x=>x.pseudo.toLowerCase()===m[1].toLowerCase());
    parts.push({type:"mention",v:m[0],user:u||null});
    last=m.index+m[0].length;
  }
  if(last<text.length)parts.push({type:"text",v:text.slice(last)});
  return parts;
}
function RichText({ text, users, t, onProfileClick }) {
  const parts=parseMentions(text, users||[]);
  return <span>{parts.map((p,i)=>p.type==="mention"
    ?<span key={i} onClick={()=>p.user&&onProfileClick&&onProfileClick(p.user.id)} style={{color:t.accent,fontWeight:700,cursor:p.user?"pointer":"default"}}>{p.v}</span>
    :<span key={i}>{p.v}</span>
  )}</span>;
}

function SocialPage({ posts, setPosts, user, users, t, setNotifs, setTab, setViewProfile }) {
  const[text,setText]=useState("");
  const[tag,setTag]=useState("Race Day");
  const[form,setForm]=useState(false);
  const[imgPrev,setImgPrev]=useState(null);
  const[showMentions,setShowMentions]=useState(false);
  const[mentionQ,setMentionQ]=useState("");
  const imgRef=useRef(null);
  const canPost=user.role==="admin"||user.role==="pilote";

  const handleText=v=>{
    setText(v);
    const match=v.match(/@(\w*)$/);
    if(match){setShowMentions(true);setMentionQ(match[1]);}else setShowMentions(false);
  };
  const addMention=pseudo=>{setText(p=>p.replace(/@\w*$/,"@"+pseudo+" "));setShowMentions(false);};
  const filteredUsers=users.filter(u=>u.id!==user.id&&u.pseudo.toLowerCase().includes(mentionQ.toLowerCase())).slice(0,5);

  const submit=()=>{
    if(!text.trim()&&!imgPrev)return;
    const mentions=[];
    const re=/@(\w+)/g; let m;
    while((m=re.exec(text))!==null){const u=users.find(x=>x.pseudo.toLowerCase()===m[1].toLowerCase());if(u&&u.id!==user.id)mentions.push(u.id);}
    const post={id:Date.now(),authorId:user.id,pseudo:user.pseudo,av:user.av,color:user.color,team:user.team||"",num:user.num,time:"maintenant",tag,tagColor:POST_TAGS[tag],text,image:imgPrev,likes:[],comments:[],reported:false,mentions};
    setPosts([post,...posts]);
    mentions.forEach(mid=>setNotifs(prev=>[{id:Date.now()+mid,type:"mention",from:user.pseudo,text:"t'a mentionné dans une publication",time:"maintenant",read:false,targetId:mid},...prev]));
    setText("");setImgPrev(null);setForm(false);
  };

  const like=id=>setPosts(posts.map(p=>{
    if(p.id!==id)return p;
    const has=p.likes.includes(user.id);
    if(!has&&p.authorId!==user.id)setNotifs(prev=>[{id:Date.now(),type:"like",from:user.pseudo,text:"a aimé ta publication",time:"maintenant",read:false,targetId:p.authorId},...prev]);
    return{...p,likes:has?p.likes.filter(x=>x!==user.id):[...p.likes,user.id]};
  }));

  const goProfile=uid=>{setViewProfile(uid);setTab("publicProfile");};

  return (
    <div>
      <TopBar title="Réseau Pilotes" t={t} right={canPost&&<button onClick={()=>setForm(!form)} style={{background:t.grad,border:"none",borderRadius:10,padding:"7px 14px",color:"#fff",fontWeight:700,cursor:"pointer",fontSize:13,flexShrink:0,minHeight:36}}>✏️ Publier</button>}/>
      <div style={{padding:"14px 14px 0"}}>
        {form&&canPost&&(
          <div style={{background:t.card,borderRadius:18,padding:16,marginBottom:14,border:`1px solid ${t.accent}55`,boxShadow:t.glow}}>
            <div style={{display:"flex",gap:10,marginBottom:12}}>
              <Av src={user.avatar} letter={user.av} color={user.color} size={38}/>
              <div><div style={{fontWeight:800,color:t.text,fontSize:14}}>{user.pseudo}</div><div style={{fontSize:12,color:t.muted}}>{user.role==="admin"?"Admin":user.team}</div></div>
            </div>
            <div style={{position:"relative",marginBottom:10}}>
              <textarea value={text} onChange={e=>handleText(e.target.value)} placeholder="Partage… utilise @ pour mentionner" style={{width:"100%",minHeight:80,background:t.inp,border:`1.5px solid ${t.border}`,borderRadius:12,padding:12,color:t.text,fontSize:16,outline:"none",resize:"vertical",boxSizing:"border-box",fontFamily:"inherit"}}/>
              {showMentions&&filteredUsers.length>0&&(
                <div style={{position:"absolute",bottom:"calc(100% + 4px)",left:0,right:0,background:t.card,border:`1px solid ${t.border}`,borderRadius:12,overflow:"hidden",zIndex:10,boxShadow:t.shadow}}>
                  {filteredUsers.map(u=>(
                    <button key={u.id} onClick={()=>addMention(u.pseudo)} style={{width:"100%",padding:"11px 14px",background:"transparent",border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:10,minHeight:48}}>
                      <Av src={u.avatar} letter={u.av} color={u.color} size={28}/><span style={{fontWeight:700,color:t.text,fontSize:14}}>@{u.pseudo}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            {imgPrev&&(
              <div style={{position:"relative",marginBottom:10,borderRadius:12,overflow:"hidden",maxHeight:220}}>
                <img src={imgPrev} alt="" style={{width:"100%",objectFit:"cover",display:"block"}}/>
                <button onClick={()=>setImgPrev(null)} style={{position:"absolute",top:8,right:8,background:"rgba(0,0,0,0.8)",border:"none",borderRadius:"50%",width:30,height:30,cursor:"pointer",color:"#fff",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
              </div>
            )}
            <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:12}}>
              {Object.entries(POST_TAGS).map(([tg,c])=>(
                <button key={tg} onClick={()=>setTag(tg)} style={{padding:"6px 12px",borderRadius:20,border:`1px solid ${tag===tg?c:t.border}`,background:tag===tg?c+"22":"transparent",color:tag===tg?c:t.muted,fontWeight:700,cursor:"pointer",fontSize:12,minHeight:36}}>
                  {tg}
                </button>
              ))}
            </div>
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              <button onClick={()=>imgRef.current?.click()} style={{background:t.el,border:`1px solid ${t.border}`,borderRadius:10,padding:"10px 14px",cursor:"pointer",color:t.sub,fontSize:13,fontWeight:600,minHeight:44}}>📷</button>
              <input ref={imgRef} type="file" accept="image/*" onChange={e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>setImgPrev(ev.target.result);r.readAsDataURL(f);}} style={{display:"none"}}/>
              <div style={{flex:1}}/>
              <button onClick={()=>setForm(false)} style={{background:"none",border:`1px solid ${t.border}`,borderRadius:10,padding:"10px 14px",cursor:"pointer",color:t.muted,fontSize:13,fontWeight:600,minHeight:44}}>Annuler</button>
              <Btn onClick={submit} t={t} disabled={!text.trim()&&!imgPrev}>Publier 🚀</Btn>
            </div>
          </div>
        )}
        {posts.map(p=>(
          <PostCard key={p.id} post={p} user={user} users={users} t={t}
            onLike={()=>like(p.id)}
            onDelete={()=>setPosts(posts.filter(x=>x.id!==p.id))}
            onReport={()=>setPosts(posts.map(x=>x.id===p.id?{...x,reported:true}:x))}
            onProfileClick={goProfile}
            setNotifs={setNotifs}
          />
        ))}
      </div>
    </div>
  );
}

function PostCard({ post, user, users, t, onLike, onDelete, onReport, onProfileClick, setNotifs }) {
  const[cmt,setCmt]=useState(""); const[cmts,setCmts]=useState(post.comments); const[showCmt,setShowCmt]=useState(false);
  const liked=post.likes.includes(user.id);
  const canDelete=user.role==="admin"||user.id===post.authorId;
  const submitCmt=()=>{
    if(!cmt.trim())return;
    setCmts([...cmts,{id:Date.now(),authorId:user.id,pseudo:user.pseudo,text:cmt,time:"maintenant"}]);
    if(post.authorId!==user.id)setNotifs(prev=>[{id:Date.now(),type:"comment",from:user.pseudo,text:"a commenté ta publication",time:"maintenant",read:false,targetId:post.authorId},...prev]);
    setCmt("");
  };
  return (
    <div style={{background:t.card,borderRadius:18,overflow:"hidden",border:`1px solid ${post.reported?"#c0404044":t.border}`,marginBottom:12}}>
      {post.reported&&user.role==="admin"&&<div style={{background:"rgba(192,0,0,0.1)",padding:"5px 14px",fontSize:12,color:"#f08080",fontWeight:700}}>⚠ Post signalé</div>}
      {/* Header */}
      <div style={{padding:"13px 14px",display:"flex",alignItems:"center",gap:11}}>
        <button onClick={()=>onProfileClick&&onProfileClick(post.authorId)} style={{background:"none",border:"none",cursor:"pointer",padding:0,flexShrink:0}}>
          <Av src={null} letter={post.av} color={post.color} size={42}/>
        </button>
        <div style={{flex:1,minWidth:0}}>
          <div style={{display:"flex",alignItems:"center",gap:7}}>
            <button onClick={()=>onProfileClick&&onProfileClick(post.authorId)} style={{background:"none",border:"none",cursor:"pointer",padding:0,fontWeight:800,color:t.text,fontSize:15}}>
              {post.pseudo}
            </button>
            {post.num&&<span style={{fontSize:12,color:t.muted}}>#{post.num}</span>}
          </div>
          <div style={{fontSize:12,color:t.muted}}>{post.team} · {post.time}</div>
        </div>
        <Chip label={post.tag} color={post.tagColor}/>
        {canDelete&&(
          <button onClick={onDelete} style={{background:"none",border:"none",cursor:"pointer",color:t.muted,fontSize:18,padding:6,minWidth:36,minHeight:36,display:"flex",alignItems:"center",justifyContent:"center"}}>🗑️</button>
        )}
      </div>
      {/* Text */}
      {post.text&&<div style={{padding:"0 14px 12px"}}><p style={{color:t.text,fontSize:15,lineHeight:1.65,margin:0}}><RichText text={post.text} users={users} t={t} onProfileClick={onProfileClick}/></p></div>}
      {/* Image */}
      {post.image&&<div style={{maxHeight:300,overflow:"hidden"}}><img src={post.image} alt="" style={{width:"100%",objectFit:"cover",display:"block"}}/></div>}
      {/* Actions */}
      <div style={{padding:"10px 14px",borderTop:`1px solid ${t.border}`,display:"flex",gap:16,alignItems:"center"}}>
        <button onClick={onLike} style={{background:"none",border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:6,color:liked?t.accent:t.muted,fontWeight:700,fontSize:15,minHeight:44,minWidth:44}}>
          <span style={{fontSize:20}}>{liked?"❤️":"🤍"}</span>{post.likes.length}
        </button>
        <button onClick={()=>setShowCmt(!showCmt)} style={{background:"none",border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:6,color:t.muted,fontWeight:600,fontSize:15,minHeight:44,minWidth:44}}>
          <span style={{fontSize:20}}>💬</span>{cmts.length}
        </button>
        {user.id!==post.authorId&&!post.reported&&(
          <button onClick={onReport} style={{background:"none",border:"none",cursor:"pointer",color:t.muted,fontSize:13,marginLeft:"auto",minHeight:44,padding:"0 6px"}}>🚩 Signaler</button>
        )}
      </div>
      {/* Comments */}
      {showCmt&&(
        <div style={{padding:"0 14px 14px",borderTop:`1px solid ${t.border}`,paddingTop:12}}>
          {cmts.map((c,i)=>(
            <div key={i} style={{display:"flex",gap:9,marginBottom:8}}>
              <div style={{width:28,height:28,borderRadius:8,background:t.accent+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:t.accent,flexShrink:0}}>{c.pseudo.slice(0,2).toUpperCase()}</div>
              <div style={{background:t.el,borderRadius:10,padding:"8px 12px",flex:1}}>
                <div style={{fontSize:12,fontWeight:700,color:t.accent,marginBottom:2}}>{c.pseudo}</div>
                <div style={{fontSize:14,color:t.text,lineHeight:1.5}}><RichText text={c.text} users={users} t={t}/></div>
              </div>
            </div>
          ))}
          <div style={{display:"flex",gap:8,marginTop:6}}>
            <input value={cmt} onChange={e=>setCmt(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submitCmt()} placeholder="Commenter…" style={{flex:1,background:t.inp,border:`1px solid ${t.border}`,borderRadius:12,padding:"12px 14px",color:t.text,fontSize:15,outline:"none",fontFamily:"inherit",minHeight:44}}/>
            <button onClick={submitCmt} style={{background:t.grad,border:"none",borderRadius:12,padding:"0 16px",color:"#fff",fontWeight:700,cursor:"pointer",fontSize:18,minHeight:44,minWidth:44}}>→</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MESSAGES
═══════════════════════════════════════════════════════════ */
function MessagesPage({ messages, setMessages, user, users, t }) {
  const[activeConv,setActiveConv]=useState(null);
  const[newMsg,setNewMsg]=useState("");
  const[showNew,setShowNew]=useState(false);
  const[showGrp,setShowGrp]=useState(false);
  const[grpName,setGrpName]=useState("");
  const[selected,setSelected]=useState([]);
  const msgEndRef=useRef(null);
  const myConvs=messages.filter(c=>c.participants.includes(user.id));

  const getName=c=>{
    if(c.type==="group")return c.name||"Groupe";
    const other=c.participants.find(id=>id!==user.id);
    const u=users.find(x=>x.id===other);
    return u?u.pseudo:"?";
  };
  const getAv=c=>{
    if(c.type==="group")return{letter:"👥",color:"#6b8aff",src:null};
    const other=c.participants.find(id=>id!==user.id);
    const u=users.find(x=>x.id===other);
    return u?{letter:u.av,color:u.color,src:u.avatar}:{letter:"?",color:"#888",src:null};
  };
  const lastMsg=c=>{
    if(!c.messages.length)return"Commencer la conversation…";
    const m=c.messages[c.messages.length-1];
    const u=users.find(x=>x.id===m.from);
    return`${u?u.pseudo.split("_")[0]:"?"}: ${m.text}`;
  };
  const send=()=>{
    if(!newMsg.trim()||!activeConv)return;
    setMessages(messages.map(c=>c.id===activeConv?{...c,messages:[...c.messages,{id:Date.now(),from:user.id,text:newMsg,time:new Date().toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"})}]}:c));
    setNewMsg("");
    setTimeout(()=>msgEndRef.current?.scrollIntoView({behavior:"smooth"}),50);
  };
  const createDM=uid=>{
    const ex=messages.find(c=>c.type==="dm"&&c.participants.includes(user.id)&&c.participants.includes(uid));
    if(ex){setActiveConv(ex.id);}else{const nc={id:Date.now(),type:"dm",participants:[user.id,uid],name:"",messages:[]};setMessages([...messages,nc]);setActiveConv(nc.id);}
    setShowNew(false);
  };
  const createGroup=()=>{
    if(!grpName.trim()||!selected.length)return;
    const nc={id:Date.now(),type:"group",participants:[user.id,...selected],name:grpName,messages:[]};
    setMessages([...messages,nc]);setActiveConv(nc.id);
    setShowGrp(false);setGrpName("");setSelected([]);
  };
  const conv=messages.find(c=>c.id===activeConv);
  const otherUsers=users.filter(u=>u.id!==user.id);

  // Mobile: if conv selected, show full screen chat
  if (activeConv&&conv) {
    return (
      <div style={{display:"flex",flexDirection:"column",height:"calc(100dvh - 56px)"}}>
        {/* Header */}
        <div style={{background:t.nav,backdropFilter:"blur(20px)",borderBottom:`1px solid ${t.border}`,padding:"env(safe-area-inset-top,0) 14px 0",flexShrink:0}}>
          <div style={{height:56,display:"flex",alignItems:"center",gap:10}}>
            <button onClick={()=>setActiveConv(null)} style={{background:"none",border:"none",cursor:"pointer",color:t.accent,fontSize:14,fontWeight:700,display:"flex",alignItems:"center",gap:4,minHeight:44,minWidth:44}}>‹</button>
            {(()=>{const av=getAv(conv);return<Av src={av.src} letter={av.letter} color={av.color} size={34}/>;})()}
            <div style={{flex:1}}>
              <div style={{fontWeight:800,color:t.text,fontSize:15}}>{getName(conv)}</div>
              {conv.type==="group"&&<div style={{fontSize:11,color:t.muted}}>{conv.participants.length} membres</div>}
            </div>
          </div>
        </div>
        {/* Messages */}
        <div style={{flex:1,overflowY:"auto",padding:"14px",display:"flex",flexDirection:"column",gap:10}}>
          {conv.messages.length===0&&<div style={{textAlign:"center",color:t.muted,fontSize:14,marginTop:30}}>Début de la conversation 💬</div>}
          {conv.messages.map(m=>{
            const isMe=m.from===user.id;
            const sender=users.find(x=>x.id===m.from);
            return (
              <div key={m.id} style={{display:"flex",flexDirection:isMe?"row-reverse":"row",alignItems:"flex-end",gap:8}}>
                {!isMe&&<Av src={sender?.avatar||null} letter={sender?.av||"?"} color={sender?.color||"#888"} size={28}/>}
                <div style={{maxWidth:"75%"}}>
                  {!isMe&&conv.type==="group"&&<div style={{fontSize:11,fontWeight:700,color:t.muted,marginBottom:3,paddingLeft:4}}>{sender?.pseudo||"?"}</div>}
                  <div style={{background:isMe?t.accent:t.el,borderRadius:isMe?"18px 18px 4px 18px":"18px 18px 18px 4px",padding:"11px 15px"}}>
                    <div style={{fontSize:15,color:isMe?"#fff":t.text,lineHeight:1.5}}>{m.text}</div>
                  </div>
                  <div style={{fontSize:11,color:t.muted,marginTop:3,textAlign:isMe?"right":"left"}}>{m.time}</div>
                </div>
              </div>
            );
          })}
          <div ref={msgEndRef}/>
        </div>
        {/* Input */}
        <div style={{padding:"10px 12px",paddingBottom:"calc(env(safe-area-inset-bottom,0px) + 66px)",borderTop:`1px solid ${t.border}`,display:"flex",gap:8,background:t.nav,backdropFilter:"blur(20px)"}}>
          <input value={newMsg} onChange={e=>setNewMsg(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Message…" style={{flex:1,background:t.inp,border:`1px solid ${t.border}`,borderRadius:24,padding:"12px 16px",color:t.text,fontSize:16,outline:"none",fontFamily:"inherit",minHeight:48}}/>
          <button onClick={send} style={{background:t.grad,border:"none",borderRadius:"50%",width:48,height:48,color:"#fff",fontWeight:700,cursor:"pointer",fontSize:20,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>→</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <TopBar title="Messages" t={t} right={
        <div style={{display:"flex",gap:6}}>
          <button onClick={()=>{setShowNew(!showNew);setShowGrp(false);}} style={{background:t.el,border:`1px solid ${t.border}`,borderRadius:10,padding:"7px 12px",cursor:"pointer",color:t.sub,fontSize:13,fontWeight:600,minHeight:36}}>+ DM</button>
          <button onClick={()=>{setShowGrp(!showGrp);setShowNew(false);}} style={{background:t.el,border:`1px solid ${t.border}`,borderRadius:10,padding:"7px 12px",cursor:"pointer",color:t.sub,fontSize:13,fontWeight:600,minHeight:36}}>+ Groupe</button>
        </div>
      }/>
      <div style={{padding:"14px 14px 0"}}>
        {showNew&&(
          <div style={{background:t.card,borderRadius:14,padding:14,marginBottom:12,border:`1px solid ${t.border}`}}>
            <div style={{fontSize:12,fontWeight:700,color:t.muted,marginBottom:10}}>NOUVEAU MESSAGE DIRECT</div>
            {otherUsers.map(u=>(
              <button key={u.id} onClick={()=>createDM(u.id)} style={{width:"100%",display:"flex",alignItems:"center",gap:12,padding:"12px",borderRadius:12,border:"none",background:"transparent",cursor:"pointer",marginBottom:3,minHeight:52}}>
                <Av src={u.avatar} letter={u.av} color={u.color} size={36}/>
                <div style={{textAlign:"left"}}><div style={{fontSize:14,fontWeight:700,color:t.text}}>{u.pseudo}</div><div style={{fontSize:12,color:t.muted}}><RolePill role={u.role} t={t}/></div></div>
              </button>
            ))}
          </div>
        )}
        {showGrp&&(
          <div style={{background:t.card,borderRadius:14,padding:14,marginBottom:12,border:`1px solid ${t.border}`}}>
            <div style={{fontSize:12,fontWeight:700,color:t.muted,marginBottom:10}}>NOUVEAU GROUPE</div>
            <input value={grpName} onChange={e=>setGrpName(e.target.value)} placeholder="Nom du groupe…" style={{width:"100%",boxSizing:"border-box",padding:"12px 14px",background:t.inp,border:`1px solid ${t.border}`,borderRadius:12,color:t.text,fontSize:15,outline:"none",fontFamily:"inherit",marginBottom:12,minHeight:48}}/>
            {otherUsers.map(u=>(
              <button key={u.id} onClick={()=>setSelected(s=>s.includes(u.id)?s.filter(x=>x!==u.id):[...s,u.id])} style={{width:"100%",display:"flex",alignItems:"center",gap:12,padding:"11px",borderRadius:12,border:"none",background:selected.includes(u.id)?t.accent+"22":"transparent",cursor:"pointer",marginBottom:3,minHeight:48}}>
                <Av src={u.avatar} letter={u.av} color={u.color} size={32}/><span style={{fontSize:14,color:t.text}}>{u.pseudo}</span>{selected.includes(u.id)&&<span style={{marginLeft:"auto",color:t.accent,fontSize:18}}>✓</span>}
              </button>
            ))}
            <Btn onClick={createGroup} t={t} disabled={!grpName.trim()||!selected.length} style={{marginTop:10}}>Créer le groupe</Btn>
          </div>
        )}
        {myConvs.length===0&&!showNew&&!showGrp&&<div style={{background:t.card,borderRadius:16,padding:36,textAlign:"center",border:`1px solid ${t.border}`}}><div style={{fontSize:32,marginBottom:10}}>💬</div><div style={{color:t.muted}}>Aucune conversation</div></div>}
        {myConvs.map(c=>{
          const av=getAv(c);
          return (
            <button key={c.id} onClick={()=>setActiveConv(c.id)} style={{width:"100%",display:"flex",alignItems:"center",gap:13,padding:"14px",borderRadius:16,border:`1px solid ${t.border}`,cursor:"pointer",background:t.card,marginBottom:8,textAlign:"left",minHeight:70}}>
              <div style={{position:"relative"}}>
                <Av src={av.src} letter={av.letter} color={av.color} size={46}/>
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontWeight:700,color:t.text,fontSize:15,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",marginBottom:3}}>{getName(c)}</div>
                <div style={{fontSize:13,color:t.muted,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{lastMsg(c)}</div>
              </div>
              <span style={{color:t.muted,fontSize:20}}>›</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   NOTIFICATIONS
═══════════════════════════════════════════════════════════ */
function NotifPage({ notifs, setNotifs, user, t }) {
  const myNotifs=notifs.filter(n=>!n.targetId||n.targetId===user.id);
  const icons={mention:"💬",like:"❤️",comment:"💬",announce:"📢"};
  return (
    <div>
      <TopBar title="Notifications" t={t} right={myNotifs.some(n=>!n.read)&&<button onClick={()=>setNotifs(notifs.map(n=>({...n,read:true})))} style={{background:"none",border:"none",color:t.accent,cursor:"pointer",fontSize:13,fontWeight:700,minHeight:36}}>Tout lire</button>}/>
      <div style={{padding:"14px 14px 0"}}>
        {myNotifs.length===0&&<div style={{background:t.card,borderRadius:16,padding:36,textAlign:"center",border:`1px solid ${t.border}`}}><div style={{fontSize:32,marginBottom:10}}>🔔</div><div style={{color:t.muted}}>Aucune notification</div></div>}
        {myNotifs.map(n=>(
          <div key={n.id} onClick={()=>setNotifs(notifs.map(x=>x.id===n.id?{...x,read:true}:x))} style={{background:t.card,borderRadius:14,padding:"14px",marginBottom:9,border:`1px solid ${n.read?t.border:t.accent+"55"}`,cursor:"pointer",display:"flex",gap:12,alignItems:"flex-start",minHeight:60}}>
            <div style={{width:40,height:40,borderRadius:11,background:t.accent+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{icons[n.type]||"🔔"}</div>
            <div style={{flex:1}}>
              <div style={{fontSize:14,color:t.text,fontWeight:n.read?500:700,lineHeight:1.5}}><span style={{color:t.accent}}>@{n.from}</span> {n.text}</div>
              <div style={{fontSize:12,color:t.muted,marginTop:3}}>Il y a {n.time}</div>
            </div>
            {!n.read&&<div style={{width:9,height:9,background:t.accent,borderRadius:"50%",flexShrink:0,marginTop:4}}/>}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   ANNOUNCEMENTS
═══════════════════════════════════════════════════════════ */
function AnnouncementsPage({ anns, setAnns, user, t }) {
  const mark=id=>setAnns(anns.map(a=>a.id===id?{...a,readBy:[...new Set([...a.readBy,user.id])]}:a));
  return (
    <div>
      <TopBar title="Annonces Officielles" t={t}/>
      <div style={{padding:"14px 14px 0"}}>
        {anns.map(a=>{
          const read=a.readBy.includes(user.id);
          return (
            <div key={a.id} onClick={()=>mark(a.id)} style={{background:t.card,borderRadius:16,padding:16,marginBottom:11,border:`1px solid ${read?t.border:t.accent+"55"}`,cursor:"pointer",boxShadow:read?"none":t.glow,transition:"all .2s"}}>
              <div style={{display:"flex",gap:12}}>
                <div style={{width:44,height:44,borderRadius:12,background:a.pinned?t.accent+"22":t.el,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{a.pinned?"📌":"📣"}</div>
                <div style={{flex:1}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4,flexWrap:"wrap"}}>
                    <span style={{fontWeight:800,color:t.text,fontSize:15}}>{a.title}</span>
                    {!read&&<div style={{width:8,height:8,background:t.accent,borderRadius:"50%"}}/>}
                    {a.pinned&&<Chip label="Épinglé" color={t.accent}/>}
                  </div>
                  <p style={{color:t.sub,fontSize:14,margin:"0 0 7px",lineHeight:1.6}}>{a.body}</p>
                  <div style={{fontSize:12,color:t.muted}}>@{a.author} · {a.time}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   PUBLIC PROFILE
═══════════════════════════════════════════════════════════ */
function PublicProfile({ profileId, users, posts, user, t, setTab, messages, setMessages }) {
  const profile=users.find(u=>u.id===profileId);
  if(!profile)return null;
  const mine=posts.filter(p=>p.authorId===profile.id);
  const full=(profile.firstName||"")+(profile.lastName?" "+profile.lastName:"");
  const startDM=()=>{
    const ex=messages.find(c=>c.type==="dm"&&c.participants.includes(user.id)&&c.participants.includes(profile.id));
    if(!ex)setMessages([...messages,{id:Date.now(),type:"dm",participants:[user.id,profile.id],name:"",messages:[]}]);
    setTab("messages");
  };
  return (
    <div>
      <TopBar title={profile.pseudo} t={t} onBack={()=>setTab("social")} backLabel="Réseau"/>
      <div style={{padding:"14px 14px 0"}}>
        <div style={{background:t.card,borderRadius:20,overflow:"hidden",marginBottom:14,border:`1px solid ${t.border}`}}>
          <div style={{height:90,background:profile.color+"55",position:"relative"}}>
            <div style={{position:"absolute",inset:0,background:"linear-gradient(to bottom,transparent 50%,rgba(0,0,0,0.4))"}}/>
          </div>
          <div style={{padding:"0 18px 18px"}}>
            <div style={{display:"flex",alignItems:"flex-end",gap:13,marginTop:-38,marginBottom:12}}>
              <Av src={profile.avatar} letter={profile.av} color={profile.color} size={72} style={{border:`3px solid ${t.card}`}}/>
              <div style={{paddingBottom:4,flex:1,minWidth:0}}>
                {full.trim()&&<div style={{fontSize:13,color:t.muted,fontWeight:600,marginBottom:1}}>{full}</div>}
                <div style={{fontSize:18,fontWeight:900,color:t.text,lineHeight:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{profile.pseudo}</div>
                <div style={{display:"flex",gap:7,marginTop:5,flexWrap:"wrap",alignItems:"center"}}><RolePill role={profile.role} t={t}/>{profile.nat&&<span style={{fontSize:18}}>{profile.nat}</span>}</div>
              </div>
              {user.id!==profile.id&&<Btn onClick={startDM} t={t} style={{flexShrink:0}}>💬 Message</Btn>}
            </div>
            {profile.bio&&<p style={{color:t.sub,fontSize:14,margin:"0 0 14px",lineHeight:1.6}}>{profile.bio}</p>}
            <div style={{display:"flex",gap:9,flexWrap:"wrap"}}>
              {profile.num!=null&&<div style={{background:t.el,borderRadius:10,padding:"9px 14px",border:`1px solid ${t.border}`,textAlign:"center"}}><div style={{fontSize:16,fontWeight:900,color:t.accent}}>#{profile.num}</div><div style={{fontSize:10,color:t.muted,fontWeight:600}}>NUMÉRO</div></div>}
              {profile.team&&<div style={{background:t.el,borderRadius:10,padding:"9px 14px",border:`1px solid ${t.border}`,textAlign:"center"}}><div style={{fontSize:13,fontWeight:800,color:t.text}}>{profile.team}</div><div style={{fontSize:10,color:t.muted,fontWeight:600}}>ÉCURIE</div></div>}
              <div style={{background:t.el,borderRadius:10,padding:"9px 14px",border:`1px solid ${t.border}`,textAlign:"center"}}><div style={{fontSize:16,fontWeight:900,color:t.text}}>{mine.length}</div><div style={{fontSize:10,color:t.muted,fontWeight:600}}>POSTS</div></div>
            </div>
          </div>
        </div>
        <div style={{fontWeight:800,color:t.text,fontSize:15,marginBottom:12}}>📸 Publications ({mine.length})</div>
        {mine.length===0&&<div style={{background:t.card,borderRadius:14,padding:28,textAlign:"center",border:`1px solid ${t.border}`}}><div style={{fontSize:26}}>📷</div><div style={{color:t.muted,marginTop:8}}>Aucune publication</div></div>}
        {mine.map(p=>(
          <div key={p.id} style={{background:t.card,borderRadius:14,padding:14,marginBottom:9,border:`1px solid ${t.border}`}}>
            <div style={{display:"flex",gap:8,marginBottom:8,alignItems:"center"}}><Chip label={p.tag} color={p.tagColor}/><span style={{fontSize:12,color:t.muted,marginLeft:"auto"}}>{p.time}</span></div>
            {p.text&&<p style={{color:t.text,fontSize:14,margin:"0 0 8px",lineHeight:1.6}}>{p.text}</p>}
            {p.image&&<img src={p.image} alt="" style={{width:"100%",borderRadius:10,objectFit:"cover",maxHeight:200,display:"block",marginBottom:8}}/>}
            <div style={{display:"flex",gap:13,fontSize:13,color:t.muted}}><span>❤️ {p.likes.length}</span><span>💬 {p.comments.length}</span></div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MY PROFILE
═══════════════════════════════════════════════════════════ */
function ProfilePage({ user, setUser, posts, t }) {
  const[editing,setEditing]=useState(false);
  const[bio,setBio]=useState(user.bio);
  const imgRef=useRef(null);
  const mine=posts.filter(p=>p.authorId===user.id);
  const full=(user.firstName||"")+(user.lastName?" "+user.lastName:"");

  return (
    <div>
      <TopBar title="Mon Profil" t={t}/>
      <div style={{padding:"14px 14px 0"}}>
        <div style={{background:t.card,borderRadius:20,overflow:"hidden",marginBottom:14,border:`1px solid ${t.border}`}}>
          <div style={{height:90,background:t.grad,opacity:0.3}}/>
          <div style={{padding:"0 18px 18px"}}>
            <div style={{display:"flex",alignItems:"flex-end",gap:12,marginTop:-38,marginBottom:12}}>
              <div style={{position:"relative",flexShrink:0}}>
                <Av src={user.avatar} letter={user.av} color={user.color} size={72} style={{border:`3px solid ${t.card}`}}/>
                <button onClick={()=>imgRef.current?.click()} style={{position:"absolute",bottom:-4,right:-4,width:28,height:28,borderRadius:"50%",background:t.accent,border:`2px solid ${t.card}`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13}}>📷</button>
                <input ref={imgRef} type="file" accept="image/*" onChange={e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>setUser({...user,avatar:ev.target.result});r.readAsDataURL(f);}} style={{display:"none"}}/>
              </div>
              <div style={{flex:1,paddingBottom:4,minWidth:0}}>
                {full.trim()&&<div style={{fontSize:13,color:t.muted,fontWeight:600,marginBottom:1}}>{full}</div>}
                <div style={{fontSize:18,fontWeight:900,color:t.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{user.pseudo}</div>
                <div style={{display:"flex",gap:7,marginTop:5,alignItems:"center"}}><RolePill role={user.role} t={t}/>{user.nat&&<span style={{fontSize:18}}>{user.nat}</span>}</div>
              </div>
              <Btn onClick={()=>{if(editing)setUser({...user,bio});setEditing(!editing);}} variant="secondary" t={t} style={{flexShrink:0}}>{editing?"💾 Sauv.":"✏️ Éditer"}</Btn>
            </div>
            {editing
              ?<Inp label="BIO" value={bio} onChange={setBio} placeholder="Ta bio…" multi rows={2} t={t}/>
              :(user.bio&&<p style={{color:t.sub,fontSize:14,margin:"0 0 12px",lineHeight:1.6}}>{user.bio}</p>)
            }
            <div style={{display:"flex",gap:9,flexWrap:"wrap"}}>
              {user.num!=null&&<div style={{background:t.el,borderRadius:10,padding:"9px 14px",border:`1px solid ${t.border}`,textAlign:"center"}}><div style={{fontSize:16,fontWeight:900,color:t.accent}}>#{user.num}</div><div style={{fontSize:10,color:t.muted,fontWeight:600}}>N°</div></div>}
              {user.team&&<div style={{background:t.el,borderRadius:10,padding:"9px 14px",border:`1px solid ${t.border}`,textAlign:"center"}}><div style={{fontSize:13,fontWeight:800,color:t.text}}>{user.team}</div><div style={{fontSize:10,color:t.muted,fontWeight:600}}>ÉCURIE</div></div>}
              <div style={{background:t.el,borderRadius:10,padding:"9px 14px",border:`1px solid ${t.border}`,textAlign:"center"}}><div style={{fontSize:16,fontWeight:900,color:t.text}}>{mine.length}</div><div style={{fontSize:10,color:t.muted,fontWeight:600}}>POSTS</div></div>
              <div style={{background:t.el,borderRadius:10,padding:"9px 14px",border:`1px solid ${t.border}`,textAlign:"center"}}><div style={{fontSize:13,fontWeight:700,color:t.text}}>{user.joined}</div><div style={{fontSize:10,color:t.muted,fontWeight:600}}>MEMBRE</div></div>
            </div>
          </div>
        </div>
        <div style={{fontWeight:800,color:t.text,fontSize:15,marginBottom:12}}>📸 Mes publications ({mine.length})</div>
        {mine.length===0&&<div style={{background:t.card,borderRadius:14,padding:28,textAlign:"center",border:`1px solid ${t.border}`}}><div style={{fontSize:26}}>📷</div><div style={{color:t.muted,marginTop:8}}>Aucune publication</div></div>}
        {mine.map(p=>(
          <div key={p.id} style={{background:t.card,borderRadius:14,padding:14,marginBottom:9,border:`1px solid ${t.border}`}}>
            <div style={{display:"flex",gap:8,marginBottom:8,alignItems:"center"}}><Chip label={p.tag} color={p.tagColor}/><span style={{fontSize:12,color:t.muted,marginLeft:"auto"}}>{p.time}</span></div>
            {p.text&&<p style={{color:t.text,fontSize:14,margin:"0 0 8px",lineHeight:1.6}}>{p.text}</p>}
            {p.image&&<img src={p.image} alt="" style={{width:"100%",borderRadius:10,objectFit:"cover",maxHeight:200,display:"block",marginBottom:8}}/>}
            <div style={{display:"flex",gap:13,fontSize:13,color:t.muted}}><span>❤️ {p.likes.length}</span><span>💬 {p.comments.length}</span></div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   ADMIN PANEL
═══════════════════════════════════════════════════════════ */
function AdminPage({ races, setRaces, posts, setPosts, anns, setAnns, t }) {
  const[sec,setSec]=useState("overview");
  const[rf,setRf]=useState({name:"",circuit:"",date:"",round:"",cat:"F1",flag:"🏁"});
  const[rows,setRows]=useState([{pos:1,driver:"",team:"",gap:"",pts:25,fl:false},{pos:2,driver:"",team:"",gap:"",pts:18,fl:false},{pos:3,driver:"",team:"",gap:"",pts:15,fl:false}]);
  const[af,setAf]=useState({title:"",body:"",pinned:false});

  const submitRace=()=>{
    if(!rf.name.trim()||!rf.date.trim())return;
    setRaces([...races,{id:Date.now(),...rf,round:parseInt(rf.round)||races.length+1,by:"Admin_OverTake",at:"maintenant",results:rows.filter(r=>r.driver.trim())}]);
    setRf({name:"",circuit:"",date:"",round:"",cat:"F1",flag:"🏁"});
    setSec("overview"); alert("✅ Résultat publié !");
  };
  const submitAnn=()=>{
    if(!af.title.trim()||!af.body.trim())return;
    setAnns([{id:Date.now(),...af,author:"Admin_OverTake",time:"maintenant",readBy:[]},...anns]);
    setAf({title:"",body:"",pinned:false}); setSec("overview"); alert("✅ Annonce publiée !");
  };

  const SECS=[{id:"overview",i:"📊",l:"Aperçu"},{id:"race",i:"🏁",l:"Résultat"},{id:"announce",i:"📢",l:"Annonce"},{id:"moderate",i:"🛡️",l:"Modération"}];

  return (
    <div>
      <TopBar title="Panneau Admin 👑" t={t}/>
      <div style={{padding:"14px 14px 0"}}>
        {/* Section tabs */}
        <div style={{display:"flex",gap:6,marginBottom:16,overflowX:"auto",paddingBottom:2}}>
          {SECS.map(s=>(
            <button key={s.id} onClick={()=>setSec(s.id)} style={{padding:"9px 14px",borderRadius:10,border:`1px solid ${sec===s.id?t.accent:t.border}`,background:sec===s.id?t.accent+"22":"transparent",color:sec===s.id?t.accent:t.muted,fontWeight:700,cursor:"pointer",fontSize:13,whiteSpace:"nowrap",flexShrink:0,minHeight:44}}>
              {s.i} {s.l}
            </button>
          ))}
        </div>

        {sec==="overview"&&(
          <div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:14}}>
              {[{v:races.length,l:"Courses",i:"🏁"},{v:posts.length,l:"Posts",i:"📸"},{v:anns.length,l:"Annonces",i:"📢"}].map(s=>(
                <div key={s.l} style={{background:t.card,borderRadius:14,padding:"16px 12px",border:`1px solid ${t.border}`,textAlign:"center"}}>
                  <div style={{fontSize:22,marginBottom:5}}>{s.i}</div>
                  <div style={{fontSize:22,fontWeight:900,color:t.text}}>{s.v}</div>
                  <div style={{fontSize:11,color:t.muted,fontWeight:600}}>{s.l}</div>
                </div>
              ))}
            </div>
            <div style={{background:t.card,borderRadius:14,padding:16,border:`1px solid ${t.border}`}}>
              <div style={{fontWeight:800,color:t.text,fontSize:14,marginBottom:12}}>🔑 Codes d'invitation</div>
              {Object.entries(INVITE_CODES).map(([c,r])=>(
                <div key={c} style={{display:"flex",alignItems:"center",gap:10,padding:"11px 13px",background:t.el,borderRadius:10,marginBottom:7,border:`1px solid ${t.border}`,flexWrap:"wrap",gap:8}}>
                  <span style={{fontFamily:"monospace",fontWeight:900,color:t.accent,fontSize:14}}>{c}</span>
                  <RolePill role={r} t={t}/>
                </div>
              ))}
              <div style={{fontSize:12,color:t.muted,marginTop:8}}>💡 Modifie INVITE_CODES dans App.jsx</div>
            </div>
          </div>
        )}

        {sec==="race"&&(
          <div style={{background:t.card,borderRadius:18,padding:18,border:`1px solid ${t.border}`}}>
            <div style={{fontWeight:800,color:t.text,fontSize:15,marginBottom:16}}>🏁 Publier un résultat</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              <Inp label="COURSE" value={rf.name} onChange={v=>setRf({...rf,name:v})} placeholder="GP de Monaco" t={t}/>
              <Inp label="CIRCUIT" value={rf.circuit} onChange={v=>setRf({...rf,circuit:v})} placeholder="Monte Carlo" t={t}/>
              <Inp label="DATE" value={rf.date} onChange={v=>setRf({...rf,date:v})} placeholder="25 Mai 2025" t={t}/>
              <Inp label="ROUND" type="number" value={rf.round} onChange={v=>setRf({...rf,round:v})} placeholder="8" t={t}/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
              <div><div style={{fontSize:11,fontWeight:700,color:t.sub,marginBottom:6}}>CATÉGORIE</div><div style={{display:"flex",gap:7}}>{["F1","F2"].map(c=><button key={c} onClick={()=>setRf({...rf,cat:c})} style={{flex:1,padding:"11px",borderRadius:10,border:`1px solid ${rf.cat===c?t.accent:t.border}`,background:rf.cat===c?t.accent:"transparent",color:rf.cat===c?"#fff":t.muted,fontWeight:700,cursor:"pointer",minHeight:44}}>{c}</button>)}</div></div>
              <Inp label="DRAPEAU" value={rf.flag} onChange={v=>setRf({...rf,flag:v})} placeholder="🇲🇨" t={t}/>
            </div>
            <div style={{fontWeight:700,color:t.text,fontSize:14,marginBottom:10}}>Résultats</div>
            {rows.map((row,i)=>(
              <div key={i} style={{display:"grid",gridTemplateColumns:"28px 1fr 1fr 64px 42px",gap:6,marginBottom:7,alignItems:"center"}}>
                <div style={{fontWeight:900,color:i===0?t.gold:i===1?t.silver:i===2?t.bronze:t.muted,textAlign:"center",fontSize:14}}>{posIcon(i+1)}</div>
                <input value={row.driver} onChange={e=>{const r=[...rows];r[i]={...r[i],driver:e.target.value};setRows(r);}} placeholder="Pilote" style={{padding:"11px 10px",background:t.inp,border:`1px solid ${t.border}`,borderRadius:10,color:t.text,fontSize:14,outline:"none",fontFamily:"inherit",minHeight:44}}/>
                <input value={row.team} onChange={e=>{const r=[...rows];r[i]={...r[i],team:e.target.value};setRows(r);}} placeholder="Écurie" style={{padding:"11px 10px",background:t.inp,border:`1px solid ${t.border}`,borderRadius:10,color:t.text,fontSize:14,outline:"none",fontFamily:"inherit",minHeight:44}}/>
                <input value={row.gap} onChange={e=>{const r=[...rows];r[i]={...r[i],gap:e.target.value};setRows(r);}} placeholder="+1.2s" style={{padding:"11px 8px",background:t.inp,border:`1px solid ${t.border}`,borderRadius:10,color:t.text,fontSize:13,outline:"none",fontFamily:"monospace",minHeight:44}}/>
                <input type="number" value={row.pts} onChange={e=>{const r=[...rows];r[i]={...r[i],pts:parseInt(e.target.value)||0};setRows(r);}} style={{padding:"11px 6px",background:t.inp,border:`1px solid ${t.border}`,borderRadius:10,color:t.accent,fontSize:14,outline:"none",fontFamily:"inherit",fontWeight:800,textAlign:"center",minHeight:44}}/>
              </div>
            ))}
            <div style={{display:"flex",gap:9,marginTop:14}}>
              <Btn onClick={()=>setRows([...rows,{pos:rows.length+1,driver:"",team:"",gap:"",pts:0,fl:false}])} variant="secondary" t={t}>+ Ligne</Btn>
              <Btn onClick={submitRace} t={t}>✅ Publier</Btn>
            </div>
          </div>
        )}

        {sec==="announce"&&(
          <div style={{background:t.card,borderRadius:18,padding:18,border:`1px solid ${t.border}`}}>
            <div style={{fontWeight:800,color:t.text,fontSize:15,marginBottom:16}}>📢 Créer une annonce</div>
            <Inp label="TITRE" value={af.title} onChange={v=>setAf({...af,title:v})} placeholder="Titre de l'annonce" icon="📌" t={t}/>
            <Inp label="MESSAGE" value={af.body} onChange={v=>setAf({...af,body:v})} placeholder="Contenu de l'annonce…" multi rows={3} t={t}/>
            <div style={{display:"flex",alignItems:"center",gap:11,marginBottom:18,minHeight:44}}>
              <button onClick={()=>setAf({...af,pinned:!af.pinned})} style={{width:22,height:22,borderRadius:6,border:`2px solid ${af.pinned?t.accent:t.border}`,background:af.pinned?t.accent:"transparent",cursor:"pointer",flexShrink:0}}/>
              <span style={{fontSize:14,color:t.sub,fontWeight:600}}>📌 Épingler cette annonce</span>
            </div>
            <Btn onClick={submitAnn} t={t} full disabled={!af.title.trim()||!af.body.trim()}>📢 Publier l'annonce</Btn>
          </div>
        )}

        {sec==="moderate"&&(
          <div>
            <div style={{fontWeight:800,color:t.text,fontSize:15,marginBottom:12}}>🛡️ Posts signalés</div>
            {posts.filter(p=>p.reported).length===0
              ?<div style={{background:t.card,borderRadius:14,padding:28,textAlign:"center",border:`1px solid ${t.border}`,marginBottom:16}}><div style={{fontSize:28}}>✅</div><div style={{color:t.muted,marginTop:8}}>Aucun signalement</div></div>
              :posts.filter(p=>p.reported).map(p=>(
                <div key={p.id} style={{background:t.card,borderRadius:14,padding:14,marginBottom:9,border:"1px solid rgba(192,64,64,0.3)"}}>
                  <div style={{display:"flex",gap:10,marginBottom:11}}><Av src={null} letter={p.av} color={p.color} size={34}/><div style={{flex:1}}><div style={{fontWeight:700,color:t.text,fontSize:14}}>{p.pseudo}</div><p style={{color:t.sub,fontSize:13,margin:"4px 0 0",lineHeight:1.5}}>{p.text}</p></div></div>
                  <div style={{display:"flex",gap:8}}><Btn onClick={()=>setPosts(posts.map(x=>x.id===p.id?{...x,reported:false}:x))} variant="secondary" t={t}>✅ Approuver</Btn><Btn onClick={()=>setPosts(posts.filter(x=>x.id!==p.id))} variant="danger" t={t}>🗑️ Supprimer</Btn></div>
                </div>
              ))
            }
            <div style={{fontWeight:800,color:t.text,fontSize:15,marginBottom:12,marginTop:20}}>📋 Tous les posts ({posts.length})</div>
            {posts.map(p=>(
              <div key={p.id} style={{background:t.card,borderRadius:12,padding:"12px 14px",marginBottom:7,border:`1px solid ${t.border}`,display:"flex",alignItems:"center",gap:10,minHeight:56}}>
                <Av src={null} letter={p.av} color={p.color} size={30}/>
                <div style={{flex:1,minWidth:0}}><div style={{fontSize:14,fontWeight:700,color:t.text}}>{p.pseudo}</div><div style={{fontSize:12,color:t.muted,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.text||"[image]"}</div></div>
                {p.reported&&<Chip label="Signalé" color="#c04040"/>}
                <Btn onClick={()=>setPosts(posts.filter(x=>x.id!==p.id))} variant="danger" t={t} style={{padding:"8px 10px",minHeight:36,fontSize:16}}>🗑️</Btn>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   APP ROOT
═══════════════════════════════════════════════════════════ */
export default function App() {
  const[theme,setTheme]=useState("dark");
  const[user,setUser]=useState(null);
  const[users,setUsers]=useState(SEED_USERS);
  const[tab,setTab]=useState("home");
  const[drawer,setDrawer]=useState(false);
  const[races,setRaces]=useState(SEED_RACES);
  const[posts,setPosts]=useState(SEED_POSTS);
  const[anns,setAnns]=useState(SEED_ANNS);
  const[messages,setMessages]=useState(SEED_MSGS);
  const[notifs,setNotifs]=useState(SEED_NOTIFS);
  const[viewProfile,setViewProfile]=useState(null);
  const t=THEMES[theme];

  const unread=anns.filter(a=>user&&!a.readBy.includes(user.id)).length;
  const notifCount=notifs.filter(n=>!n.read&&(!n.targetId||n.targetId===user?.id)).length;
  const msgCount=messages.filter(c=>c.participants.includes(user?.id)&&c.messages.length>0&&c.messages[c.messages.length-1]?.from!==user?.id).length;

  const updateUser=u=>{setUser(u);setUsers(prev=>prev.map(x=>x.id===u.id?u:x));};

  if(!user) return <AuthScreen onLogin={u=>{setUser(u);setUsers(prev=>prev.some(x=>x.id===u.id)?prev.map(x=>x.id===u.id?u:x):[...prev,u]);setTab("home");}} t={t}/>;

  // Show bottom nav except in message chat (handled inside MessagesPage)
  const hideBottomNav = false;

  const pageContent = {
    home:          <HomePage user={user} t={t} setTab={setTab} unread={unread} notifCount={notifCount} msgCount={msgCount}/>,
    results:       <ResultsPage races={races} t={t}/>,
    standings:     <StandingsPage races={races} t={t}/>,
    social:        <SocialPage posts={posts} setPosts={setPosts} user={user} users={users} t={t} setNotifs={setNotifs} setTab={setTab} setViewProfile={setViewProfile}/>,
    announcements: <AnnouncementsPage anns={anns} setAnns={setAnns} user={user} t={t}/>,
    messages:      <MessagesPage messages={messages} setMessages={setMessages} user={user} users={users} t={t}/>,
    notifications: <NotifPage notifs={notifs} setNotifs={setNotifs} user={user} t={t}/>,
    admin:         user.role==="admin"?<AdminPage races={races} setRaces={setRaces} posts={posts} setPosts={setPosts} anns={anns} setAnns={setAnns} t={t}/>:null,
    profile:       <ProfilePage user={user} setUser={updateUser} posts={posts} t={t}/>,
    publicProfile: viewProfile?<PublicProfile profileId={viewProfile} users={users} posts={posts} user={user} t={t} setTab={setTab} messages={messages} setMessages={setMessages}/>:null,
  };

  return (
    <div style={{height:"100dvh",background:t.bg,fontFamily:"'Segoe UI',system-ui,sans-serif",color:t.text,display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
        button, input, textarea, select { font-family: inherit; }
        ::-webkit-scrollbar { width: 3px; height: 3px; }
        ::-webkit-scrollbar-thumb { background: ${t.border}; border-radius: 2px; }
        input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
      `}</style>

      {/* Scrollable content area */}
      <div style={{flex:1,overflowY:"auto",overflowX:"hidden",paddingBottom:"calc(56px + env(safe-area-inset-bottom,0px))"}}>
        {pageContent[tab] ?? pageContent["home"]}
      </div>

      {/* Bottom Nav */}
      <BottomNav tab={tab} setTab={setTab} user={user} unread={unread} notifCount={notifCount} msgCount={msgCount} t={t} onMenuOpen={()=>setDrawer(true)}/>

      {/* Side Drawer */}
      <Drawer open={drawer} onClose={()=>setDrawer(false)} user={user} tab={tab} setTab={setTab} theme={theme} setTheme={setTheme} unread={unread} notifCount={notifCount} t={t}/>
    </div>
  );
}
