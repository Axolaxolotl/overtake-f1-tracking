import { useState, useRef, useEffect } from "react";
import { supabase } from "./lib/supabase";

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
   SEED DATA (pour développement)
═══════════════════════════════════════════════════════════ */
const SEED_USERS = [
  { id:1, pseudo:"Admin_OverTake", password:"admin123", role:"admin",   firstName:"",       lastName:"",           num:null, team:null,             nat:"🇫🇷", color:"#e8002d", av:"OT", bio:"Administrateur officiel OverTake 🏎️", joined:"Janv. 2025", avatar:null },
  { id:2, pseudo:"Max_Verstappen", password:"pass123",  role:"pilote",  firstName:"Max",    lastName:"Verstappen", num:1,    team:"Red Bull Racing", nat:"🇳🇱", color:"#3671C6", av:"MV", bio:"Triple Champion du Monde 🏆 | Red Bull", joined:"Janv. 2025", avatar:null },
  { id:3, pseudo:"Lewis_Hamilton", password:"pass123",  role:"pilote",  firstName:"Lewis",  lastName:"Hamilton",   num:44,   team:"Ferrari",         nat:"🇬🇧", color:"#E8002D", av:"LH", bio:"7× Champion. Forza Ferrari 🔴", joined:"Fév. 2025", avatar:null },
];
const SEED_RACES = [
  { id:1, name:"GP de Bahreïn", circuit:"Sakhir", date:"2 Mars 2025", round:1, cat:"F1", flag:"🇧🇭", by:"Admin_OverTake", at:"Il y a 3j",
    results:[{pos:1,driver:"Max Verstappen",team:"Red Bull Racing",gap:"1:30:55.554",pts:25,fl:false},{pos:2,driver:"Charles Leclerc",team:"Ferrari",gap:"+6.490s",pts:18,fl:false}]},
  { id:2, name:"GP d'Arabie Saoudite", circuit:"Jeddah", date:"9 Mars 2025", round:2, cat:"F1", flag:"🇸🇦", by:"Admin_OverTake", at:"Il y a 1j",
    results:[{pos:1,driver:"Lewis Hamilton",team:"Ferrari",gap:"1:21:14.894",pts:25,fl:false},{pos:2,driver:"Max Verstappen",team:"Red Bull Racing",gap:"+2.119s",pts:18,fl:true}]},
];
const SEED_POSTS = [
  { id:1, authorId:2, pseudo:"Max_Verstappen", av:"MV", color:"#3671C6", team:"Red Bull Racing", num:1, time:"2h", tag:"Race Day", tagColor:"#e8002d", text:"Victoire à Bahreïn ! 🏆 La voiture était parfaite. Merci à toute l'équipe ! 💪", image:null, likes:[3,4,5], comments:[], reported:false, mentions:[] },
  { id:2, authorId:3, pseudo:"Lewis_Hamilton", av:"LH", color:"#E8002D", team:"Ferrari", num:44, time:"5h", tag:"Victory", tagColor:"#ffd700", text:"Premier podium avec Ferrari ❤️ Ce moment... Forza Ferrari !", image:null, likes:[2,4,5,6], comments:[], reported:false, mentions:[] },
];
const SEED_ANNS = [
  { id:1, title:"Calendrier 2025 disponible !", body:"18 courses au programme cette saison. Le calendrier complet est maintenant publié !", author:"Admin_OverTake", time:"Il y a 2j", pinned:true, readBy:[] },
  { id:2, title:"Bienvenue sur OverTake ! 🏎️", body:"La plateforme officielle de notre communauté F1/F2 est en ligne !", author:"Admin_OverTake", time:"Il y a 5j", pinned:false, readBy:[] },
];
const SEED_MSGS = [
  { id:1, type:"dm", participants:[2,3], name:"", messages:[{id:1,from:2,text:"Alors, prêt pour Bahreïn ?",time:"10:30"},{id:2,from:3,text:"Ferrari est au top cette année 🔴",time:"10:32"}] },
];
const SEED_NOTIFS = [
  { id:1, type:"mention", from:"Lewis_Hamilton", text:"t'a mentionné", time:"5h", read:false, targetId:5 },
  { id:2, type:"like", from:"Lando_Norris", text:"a aimé ta publication", time:"2h", read:false, targetId:2 },
];
const WDC = [
  {id:1,name:"Max Verstappen",  short:"Verstappen",team:"Red Bull Racing",num:1, nat:"🇳🇱",pts:43,color:"#3671C6"},
  {id:2,name:"Lewis Hamilton",  short:"Hamilton",  team:"Ferrari",        num:44,nat:"🇬🇧",pts:37,color:"#E8002D"},
  {id:3,name:"Charles Leclerc",short:"Leclerc",   team:"Ferrari",        num:16,nat:"🇲🇨",pts:28,color:"#E8002D"},
  {id:4,name:"Lando Norris",   short:"Norris",    team:"McLaren",        num:4, nat:"🇬🇧",pts:27,color:"#FF8000"},
];
const WCC = [
  {team:"Ferrari",        color:"#E8002D",pts:65},
  {team:"Red Bull Racing",color:"#3671C6",pts:61},
  {team:"McLaren",        color:"#FF8000",pts:42},
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
      {letter?.slice(0,2).toUpperCase() || "?"}
    </div>
  );
}
function Chip({ label, color }) {
  return <span style={{background:color+"20",border:`1px solid ${color}44`,borderRadius:20,padding:"3px 9px",fontSize:11,fontWeight:700,color,flexShrink:0}}>{label}</span>;
}
function RolePill({ role, t }) {
  const m={admin:["👑 Admin",t?.accent || "#e8002d"],pilote:["🏎️ Pilote","#6b8aff"],spectateur:["👁️ Spectateur","#6677aa"]};
  const[l,c]=m[role]||["?","#888"];
  return <Chip label={l} color={c}/>;
}
function Btn({ children, onClick, variant="primary", disabled=false, style={}, t, full=false }) {
  const theme = t || THEMES.dark;
  const v={
    primary:{background:theme.grad,color:"#fff",border:"none",boxShadow:disabled?"none":theme.glow},
    secondary:{background:theme.el,color:theme.text,border:`1px solid ${theme.border}`},
    ghost:{background:"transparent",color:theme.muted,border:`1px solid ${theme.border}`},
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
  const theme = t || THEMES.dark;
  const base={width:"100%",boxSizing:"border-box",padding:`13px ${icon?"42px":"14px"}`,background:theme.inp,border:`1.5px solid ${f?theme.bFocus:error?"#c04040":theme.border}`,borderRadius:12,color:theme.text,fontSize:16,outline:"none",fontFamily:"inherit",transition:"border-color .15s",minHeight:multi?"80px":"auto"};
  return (
    <div style={{marginBottom:14}}>
      {label&&<div style={{fontSize:11,fontWeight:700,color:theme.sub,marginBottom:6,letterSpacing:"0.8px"}}>{label}</div>}
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
        <span style={{fontSize:size*0.5}}>🏎️</span>
      </div>
      <div>
        <div style={{fontSize:size*0.47,fontWeight:900,color:"#f5f5f5",letterSpacing:"-0.5px",lineHeight:1,fontStyle:"italic"}}><span style={{color:"#e8002d"}}>Over</span>Take</div>
        <div style={{fontSize:size*0.22,color:"#666",letterSpacing:"1.5px",fontWeight:700,lineHeight:1}}>F1 TRACKING</div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   TOP BAR
═══════════════════════════════════════════════════════════ */
function TopBar({ title, t, right, onBack, backLabel }) {
  const theme = t || THEMES.dark;
  return (
    <div style={{position:"sticky",top:0,zIndex:100,background:theme.nav,backdropFilter:"blur(20px)",borderBottom:`1px solid ${theme.border}`,padding:"env(safe-area-inset-top,0) 16px 0",paddingBottom:0}}>
      <div style={{height:56,display:"flex",alignItems:"center",gap:10}}>
        {onBack
          ? <button onClick={onBack} style={{background:"none",border:"none",cursor:"pointer",color:theme.accent,fontSize:14,fontWeight:700,display:"flex",alignItems:"center",gap:4,flexShrink:0,padding:"4px 0",minWidth:44,minHeight:44}}>‹ {backLabel||"Retour"}</button>
          : <Logo size={30}/>
        }
        <div style={{flex:1,textAlign:onBack?"center":"left",fontWeight:900,color:theme.text,fontSize:17,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",marginRight:onBack?44:0}}>{onBack?title:""}</div>
        {right||null}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   BOTTOM NAV
═══════════════════════════════════════════════════════════ */
function BottomNav({ tab, setTab, user, unread, notifCount, msgCount, t, onMenuOpen }) {
  const theme = t || THEMES.dark;
  const items = [
    { id:"home",     icon:"🏠", label:"Accueil" },
    { id:"social",   icon:"📸", label:"Réseau" },
    { id:"results",  icon:"📊", label:"Résultats" },
    { id:"messages", icon:"💬", label:"Messages", badge:msgCount },
    { id:"more",     icon:null,  label:"Menu",  isTire:true },
  ];
  return (
    <div style={{position:"fixed",bottom:0,left:0,right:0,zIndex:200,background:theme.nav,backdropFilter:"blur(20px)",borderTop:`1px solid ${theme.border}`,paddingBottom:"env(safe-area-inset-bottom,0)",display:"flex"}}>
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
              {showBadge&&<div style={{position:"absolute",top:-3,right:-5,width:8,height:8,background:theme.accent,borderRadius:"50%"}}/>}
            </div>
            <span style={{fontSize:10,fontWeight:active?700:500,color:active?theme.accent:theme.muted,letterSpacing:"0.2px"}}>{item.label}</span>
            {active&&<div style={{position:"absolute",top:0,left:"20%",right:"20%",height:2,background:theme.accent,borderRadius:"0 0 2px 2px"}}/>}
          </button>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SIDE DRAWER
═══════════════════════════════════════════════════════════ */
function Drawer({ open, onClose, user, tab, setTab, theme, setTheme, unread, notifCount, t, onLogout }) {
  const themeObj = t || THEMES.dark;
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
      <div style={{position:"fixed",top:0,right:0,bottom:0,width:"min(320px,90vw)",background:themeObj.card,borderLeft:`1px solid ${themeObj.border}`,zIndex:400,transform:open?"translateX(0)":"translateX(100%)",transition:"transform 0.28s cubic-bezier(0.4,0,0.2,1)",display:"flex",flexDirection:"column",paddingTop:"env(safe-area-inset-top,0)",paddingBottom:"env(safe-area-inset-bottom,0)",boxShadow:open?"-12px 0 60px rgba(0,0,0,0.6)":"none"}}>
        <div style={{padding:"16px 16px 12px",borderBottom:`1px solid ${themeObj.border}`,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <Logo size={30}/>
          <button onClick={onClose} style={{background:themeObj.el,border:`1px solid ${themeObj.border}`,borderRadius:10,width:36,height:36,cursor:"pointer",color:themeObj.muted,fontSize:20,display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
        </div>
        {user&&(
          <div style={{padding:"14px 16px",borderBottom:`1px solid ${themeObj.border}`,display:"flex",alignItems:"center",gap:12}}>
            <Av src={user.avatar} letter={user.av} color={user.color} size={46}/>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontWeight:800,color:themeObj.text,fontSize:15,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{user.pseudo}</div>
              <div style={{marginTop:3}}><RolePill role={user.role} t={themeObj}/></div>
            </div>
          </div>
        )}
        <div style={{flex:1,overflowY:"auto",padding:"8px"}}>
          {items.map(item=>(
            <button key={item.id} onClick={()=>{setTab(item.id);onClose();}}
              style={{width:"100%",display:"flex",alignItems:"center",gap:13,padding:"13px 12px",borderRadius:12,border:"none",cursor:"pointer",background:tab===item.id?themeObj.accent+"22":"transparent",color:tab===item.id?themeObj.accent:themeObj.text,fontWeight:tab===item.id?700:500,fontSize:15,textAlign:"left",marginBottom:2,position:"relative",minHeight:48}}>
              <span style={{fontSize:20}}>{item.icon}</span>
              {item.label}
              {item.badge>0&&<span style={{marginLeft:"auto",background:themeObj.accent,color:"#fff",borderRadius:20,fontSize:11,fontWeight:800,padding:"2px 8px"}}>{item.badge}</span>}
              {tab===item.id&&<div style={{position:"absolute",left:0,top:"15%",bottom:"15%",width:3,background:themeObj.accent,borderRadius:"0 3px 3px 0"}}/>}
            </button>
          ))}
        </div>
        <div style={{padding:"12px 16px",borderTop:`1px solid ${themeObj.border}`}}>
          <div style={{fontSize:11,fontWeight:700,color:themeObj.muted,marginBottom:9,letterSpacing:"1px"}}>THÈME</div>
          <div style={{display:"flex",gap:8}}>
            {Object.entries(THEMES).map(([k,th])=>(
              <button key={k} onClick={()=>setTheme(k)} style={{flex:1,padding:"9px 0",borderRadius:10,border:`1.5px solid ${theme===k?themeObj.accent:themeObj.border}`,background:theme===k?themeObj.accent+"22":"transparent",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:3,minHeight:44}}>
                <span style={{fontSize:17}}>{th.icon}</span>
                <span style={{fontSize:10,fontWeight:700,color:theme===k?themeObj.accent:themeObj.muted}}>{th.name}</span>
              </button>
            ))}
          </div>
        </div>
        <button onClick={onLogout} style={{margin:"0 14px 14px",padding:"13px",borderRadius:12,border:"1px solid #c0404044",background:"rgba(192,64,64,0.1)",color:"#f06060",fontWeight:700,cursor:"pointer",fontSize:14,minHeight:44}}>
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
  const[loading,setLoading]=useState(false);
  const theme = t || THEMES.dark;

  const doCode=()=>{
    const r=INVITE_CODES[code.trim().toUpperCase()];
    if(r){setRole(r);setCodeErr("");setStep("register");}
    else setCodeErr("Code invalide — contacte un admin.");
  };

  const doLogin=async()=>{
    setLoading(true); setLiErr("");
    try {
      // Mode démo - pas de Supabase
      const demoUser = SEED_USERS.find(u => u.pseudo === li.pseudo && u.password === li.password);
      if (demoUser) {
        onLogin(demoUser);
        setLoading(false);
        return;
      }
      
      // Tentative Supabase
      const email=`${li.pseudo.trim().toLowerCase()}@overtake.app`;
      const{data,error}=await supabase.auth.signInWithPassword({email,password:li.password});
      if(error){setLiErr("Identifiant ou mot de passe incorrect.");setLoading(false);return;}
      if(data?.user){
        const{data:profile}=await supabase.from('profiles').select('*').eq('id',data.user.id).single();
        if(profile){
          onLogin({
            id:data.user.id,
            pseudo:profile.username,
            password:"",
            role:profile.role||"spectateur",
            firstName:profile.display_name?.split(" ")[0]||"",
            lastName:profile.display_name?.split(" ").slice(1).join(" ")||"",
            num:profile.race_number||null,
            team:profile.team||"Sans équipe",
            nat:profile.nationality||"🇫🇷",
            color:profile.color||AV_COLORS[0],
            av:profile.username.slice(0,2).toUpperCase(),
            bio:profile.bio||"",
            joined:"2025",
            avatar:profile.avatar_url||null
          });
        }
      }
    } catch(e){setLiErr("Erreur de connexion.");}
    setLoading(false);
  };

  const doReg=async()=>{
    const e={};
    if(!reg.pseudo.trim())e.pseudo="Requis";
    if(reg.password.length<6)e.password="Min. 6 caractères";
    if(reg.password!==reg.confirm)e.confirm="Ne correspond pas";
    if(Object.keys(e).length){setRegErr(e);return;}
    setLoading(true);
    
    // Mode démo
    const newId = Date.now();
    const newUser = {
      id: newId,
      pseudo: reg.pseudo.trim(),
      password: "",
      role: role || "spectateur",
      firstName: reg.firstName.trim(),
      lastName: reg.lastName.trim(),
      num: reg.num ? parseInt(reg.num) : null,
      team: reg.team.trim() || "Sans équipe",
      nat: reg.nat,
      color: AV_COLORS[Math.floor(Math.random()*AV_COLORS.length)],
      av: reg.pseudo.slice(0,2).toUpperCase(),
      bio: "",
      joined: "2025",
      avatar: null
    };
    onLogin(newUser);
    setLoading(false);
  };

  return (
    <div style={{minHeight:"100dvh",background:theme.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"env(safe-area-inset-top,20px) 20px env(safe-area-inset-bottom,20px)",overflowY:"auto"}}>
      <div style={{textAlign:"center",marginBottom:28}}>
        <div style={{width:96,height:96,background:"#fff",borderRadius:24,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px",boxShadow:"0 8px 40px rgba(232,0,45,0.3)",overflow:"hidden"}}>
          <span style={{fontSize:48}}>🏎️</span>
        </div>
        <div style={{fontSize:30,fontWeight:900,color:theme.text,letterSpacing:"-0.5px",fontStyle:"italic"}}><span style={{color:theme.accent}}>Over</span>Take</div>
        <div style={{fontSize:11,color:theme.muted,letterSpacing:"3px",fontWeight:700,marginTop:3}}>F1 TRACKING</div>
      </div>

      <div style={{width:"100%",maxWidth:440,background:theme.card,borderRadius:22,padding:"24px 20px",boxShadow:theme.shadow,border:`1px solid ${theme.border}`}}>
        {step==="login"&&<>
          <div style={{fontSize:22,fontWeight:900,color:theme.text,marginBottom:4}}>Connexion</div>
          <div style={{fontSize:14,color:theme.muted,marginBottom:22}}>Accède à OverTake 🏎️</div>
          <Inp label="IDENTIFIANT" value={li.pseudo} onChange={v=>setLi({...li,pseudo:v})} placeholder="Admin_OverTake" icon="👤" t={theme}/>
          <Inp label="MOT DE PASSE" type="password" value={li.password} onChange={v=>setLi({...li,password:v})} placeholder="••••••••" icon="🔒" t={theme}/>
          {liErr&&<div style={{background:"rgba(192,0,0,0.1)",border:"1px solid rgba(192,0,0,0.3)",borderRadius:10,padding:"10px 14px",fontSize:13,color:"#f07070",marginBottom:14}}>⚠ {liErr}</div>}
          <Btn onClick={doLogin} t={theme} full disabled={loading}>{loading?"Connexion…":"Se connecter"}</Btn>
          <div style={{textAlign:"center",fontSize:14,color:theme.muted,marginTop:10}}>
            Pas de compte ? <button onClick={()=>setStep("code")} style={{background:"none",border:"none",color:theme.accent,fontWeight:700,cursor:"pointer",fontSize:14}}>Rejoindre</button>
          </div>
          <div style={{textAlign:"center",fontSize:12,color:theme.muted,marginTop:16}}>
            Démo: Admin_OverTake / admin123
          </div>
        </>}

        {step==="code"&&<>
          <button onClick={()=>setStep("login")} style={{background:"none",border:"none",color:theme.accent,cursor:"pointer",fontSize:14,marginBottom:16,padding:0,fontWeight:600}}>‹ Retour</button>
          <div style={{fontSize:22,fontWeight:900,color:theme.text,marginBottom:4}}>Code d'invitation</div>
          <div style={{fontSize:14,color:theme.muted,marginBottom:20}}>Fourni par un administrateur</div>
          <Inp label="CODE D'INVITATION" value={code} onChange={v=>{setCode(v);setCodeErr("");}} placeholder="PILOTE-OT25" icon="🎫" error={codeErr} t={theme}/>
          <Btn onClick={doCode} t={theme} full disabled={!code.trim()}>Valider →</Btn>
        </>}

        {step==="register"&&<>
          <button onClick={()=>setStep("code")} style={{background:"none",border:"none",color:theme.accent,cursor:"pointer",fontSize:14,marginBottom:14,padding:0,fontWeight:600}}>‹ Retour</button>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:4}}>
            <div style={{fontSize:20,fontWeight:900,color:theme.text}}>Créer un compte</div>
            <RolePill role={role} t={theme}/>
          </div>
          <div style={{fontSize:13,color:theme.muted,marginBottom:18}}>{role==="admin"?"Administrateur 👑":(role==="pilote"?"Pilote 🏎️":"Spectateur 👁️")}</div>
          <Inp label="PSEUDO" value={reg.pseudo} onChange={v=>setReg({...reg,pseudo:v})} placeholder="Charles_Leclerc" icon="👤" error={regErr.pseudo} t={theme}/>
          <Inp label="MOT DE PASSE" type="password" value={reg.password} onChange={v=>setReg({...reg,password:v})} placeholder="Min. 6 caractères" icon="🔒" error={regErr.password} t={theme}/>
          <Inp label="CONFIRMER" type="password" value={reg.confirm} onChange={v=>setReg({...reg,confirm:v})} placeholder="Répéter" icon="🔒" error={regErr.confirm} t={theme}/>
          {role==="pilote"&&(
            <div style={{background:theme.el,borderRadius:14,padding:"14px",border:`1px solid ${theme.border}`,marginBottom:14}}>
              <div style={{fontSize:11,fontWeight:800,color:theme.accent,marginBottom:12,letterSpacing:"0.8px"}}>INFOS PILOTE 🏎️</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                <Inp label="PRÉNOM" value={reg.firstName} onChange={v=>setReg({...reg,firstName:v})} placeholder="Charles" error={regErr.firstName} t={theme}/>
                <Inp label="NOM" value={reg.lastName} onChange={v=>setReg({...reg,lastName:v})} placeholder="Leclerc" error={regErr.lastName} t={theme}/>
                <Inp label="N° COURSE" type="number" value={reg.num} onChange={v=>setReg({...reg,num:v})} placeholder="16" t={theme}/>
                <Inp label="NATIONALITÉ" t={theme}>
                  <select value={reg.nat} onChange={e=>setReg({...reg,nat:e.target.value})} style={{width:"100%",padding:"13px 12px",background:theme.inp,border:`1.5px solid ${theme.border}`,borderRadius:12,color:theme.text,fontSize:16,outline:"none",cursor:"pointer",minHeight:48}}>
                    {FLAGS.map(f=><option key={f} value={f}>{f}</option>)}
                  </select>
                </Inp>
              </div>
              <Inp label="ÉCURIE / TEAM" value={reg.team} onChange={v=>setReg({...reg,team:v})} placeholder="Ferrari, McLaren…" icon="🏎️" t={theme}/>
            </div>
          )}
          <Btn onClick={doReg} t={theme} full disabled={loading}>{loading?"Inscription…":"Créer mon compte 🚀"}</Btn>
        </>}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   HOME PAGE
═══════════════════════════════════════════════════════════ */
function HomePage({ user, t, setTab, unread, notifCount, msgCount }) {
  const theme = t || THEMES.dark;
  const greet = user?.role==="pilote"&&user?.firstName ? `Bonjour, ${user.firstName} 👋` : `Bonjour, ${user?.pseudo?.split("_")[0] || "Invité"} 👋`;
  return (
    <div>
      <TopBar t={theme}/>
      <div style={{padding:"14px 14px 0"}}>
        <div style={{background:theme.card,borderRadius:20,padding:"22px 20px",marginBottom:14,border:`1px solid ${theme.border}`,position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:-40,right:-40,width:160,height:160,background:theme.accent+"0d",borderRadius:"50%",filter:"blur(40px)",pointerEvents:"none"}}/>
          <div style={{position:"relative"}}>
            <div style={{display:"inline-flex",alignItems:"center",gap:6,background:theme.accent+"22",borderRadius:20,padding:"4px 12px",marginBottom:10,border:`1px solid ${theme.accent}44`}}>
              <div style={{width:6,height:6,background:theme.accent,borderRadius:"50%",animation:"pulse 2s infinite"}}/>
              <span style={{color:theme.accent,fontSize:11,fontWeight:700,letterSpacing:"1.5px"}}>SAISON 2025 EN COURS</span>
            </div>
            <h1 style={{fontSize:24,fontWeight:900,color:theme.text,margin:"0 0 6px",lineHeight:1.15,letterSpacing:"-0.5px"}}>{greet}</h1>
            <p style={{color:theme.sub,fontSize:14,margin:"0 0 16px",lineHeight:1.6}}>
              {user?.role==="admin"&&"Panneau Admin disponible 👑"}
              {user?.role==="pilote"&&"Suis les résultats et publie sur le Réseau 🏁"}
              {user?.role==="spectateur"&&"Suis la saison en temps réel 📺"}
            </p>
            <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
              {[{v:"2",l:"Courses",i:"🏁"},{v:String(unread),l:"Annonces",i:"📢"},{v:String(notifCount),l:"Notifs",i:"🔔"}].map(s=>(
                <div key={s.l} style={{background:theme.bg,borderRadius:10,padding:"8px 13px",border:`1px solid ${theme.border}`,display:"flex",alignItems:"center",gap:7}}>
                  <span style={{fontSize:18}}>{s.i}</span>
                  <div><div style={{fontSize:16,fontWeight:900,color:theme.text,lineHeight:1}}>{s.v}</div><div style={{fontSize:10,color:theme.muted,fontWeight:600}}>{s.l}</div></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
          {[{id:"results",icon:"📊",title:"Résultats",sub:"Par course",color:theme.accent},{id:"standings",icon:"🏆",title:"Classements",sub:"WDC · WCC",color:theme.gold},{id:"messages",icon:"💬",title:"Messages",sub:"Privés & Groupes",color:"#6b8aff"},{id:"announcements",icon:"📢",title:"Annonces",sub:unread>0?`${unread} non lue(s)`:"Officielles",color:"#00aa44"}].map(c=>(
            <button key={c.id} onClick={()=>setTab(c.id)} style={{background:theme.card,borderRadius:16,padding:"16px 14px",border:`1px solid ${theme.border}`,cursor:"pointer",textAlign:"left",display:"flex",flexDirection:"column",gap:8,minHeight:100,position:"relative"}}>
              <div style={{width:36,height:36,borderRadius:10,background:c.color+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>{c.icon}</div>
              <div style={{fontWeight:800,color:theme.text,fontSize:14}}>{c.title}</div>
              <div style={{fontSize:11,color:theme.muted,lineHeight:1.4}}>{c.sub}</div>
              {c.id==="announcements"&&unread>0&&<div style={{position:"absolute",top:10,right:10,background:theme.accent,color:"#fff",borderRadius:10,fontSize:10,fontWeight:800,padding:"2px 6px"}}>{unread}</div>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   RESULTS PAGE (simplifiée)
═══════════════════════════════════════════════════════════ */
function ResultsPage({ races, t }) {
  const theme = t || THEMES.dark;
  const[open,setOpen]=useState(null);
  const list = races.length ? races : SEED_RACES;
  
  return (
    <div>
      <TopBar title="Résultats" t={theme}/>
      <div style={{padding:"14px 14px 0"}}>
        {list.map(race=>{
          const isO=open===race.id; 
          return (
            <div key={race.id} style={{background:theme.card,borderRadius:16,overflow:"hidden",border:`1px solid ${isO?theme.accent+"55":theme.border}`,marginBottom:10,boxShadow:isO?theme.glow:"none",transition:"all .2s"}}>
              <button onClick={()=>setOpen(isO?null:race.id)} style={{width:"100%",padding:"14px 16px",background:"transparent",border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:12,textAlign:"left",minHeight:72}}>
                <div style={{width:42,height:42,borderRadius:12,background:theme.accent+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{race.flag || "🏁"}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",gap:6,marginBottom:3,alignItems:"center"}}>
                    <span style={{background:theme.accent,color:"#fff",borderRadius:6,padding:"2px 8px",fontSize:11,fontWeight:800}}>{race.cat || "F1"}</span>
                    <span style={{color:theme.muted,fontSize:12}}>R{race.round} · {race.date}</span>
                  </div>
                  <div style={{fontWeight:800,color:theme.text,fontSize:15,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{race.name}</div>
                </div>
                <div style={{textAlign:"right",flexShrink:0}}>
                  <div style={{fontSize:10,color:theme.muted}}>Vainqueur</div>
                  <div style={{fontWeight:800,color:theme.gold,fontSize:13}}>🥇 {race.results?.[0]?.driver?.split(" ").pop() || "?"}</div>
                </div>
                <span style={{color:theme.muted,fontSize:18,transform:isO?"rotate(180deg)":"none",transition:"transform .2s",flexShrink:0}}>⌄</span>
              </button>
              {isO&&race.results && (
                <div style={{borderTop:`1px solid ${theme.border}`}}>
                  {race.results.map((r,i)=>(
                    <div key={i} style={{display:"grid",gridTemplateColumns:"36px 1fr 70px",gap:8,padding:"11px 16px",alignItems:"center",borderTop:i>0?`1px solid ${theme.border}22`:"none",background:i%2===0?"transparent":theme.el+"66"}}>
                      <div style={{fontWeight:900,color:posColor(r.pos,theme),fontSize:14,textAlign:"center"}}>{posIcon(r.pos)}</div>
                      <div>
                        <div style={{fontWeight:700,color:theme.text,fontSize:14}}>{r.driver}</div>
                        <div style={{fontSize:11,color:theme.muted}}>{r.team}{r.fl?" · ⚡ FL":""}</div>
                      </div>
                      <div style={{textAlign:"right"}}>
                        <div style={{fontSize:12,color:theme.muted,fontFamily:"monospace"}}>{r.pos===1?"":`+${r.pts}pt`}</div>
                        <div style={{fontWeight:900,fontSize:14,color:r.pts>=15?theme.accent:theme.text}}>+{r.pts}</div>
                      </div>
                    </div>
                  ))}
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
   STANDINGS PAGE (simplifiée)
═══════════════════════════════════════════════════════════ */
function StandingsPage({ t }) {
  const theme = t || THEMES.dark;
  const[view,setView]=useState("wdc");
  const wdcLeader=WDC[0].pts;
  
  return (
    <div>
      <TopBar title="Classements" t={theme}/>
      <div style={{padding:"14px 14px 0"}}>
        <div style={{display:"flex",gap:6,marginBottom:16,overflowX:"auto",paddingBottom:2}}>
          {[{id:"wdc",l:"🏆 Pilotes"},{id:"wcc",l:"🏭 Constructeurs"}].map(v=>(
            <button key={v.id} onClick={()=>setView(v.id)} style={{padding:"9px 16px",borderRadius:10,border:`1px solid ${view===v.id?theme.accent:theme.border}`,background:view===v.id?theme.accent+"22":"transparent",color:view===v.id?theme.accent:theme.muted,fontWeight:700,cursor:"pointer",fontSize:13,whiteSpace:"nowrap",flexShrink:0,minHeight:44}}>
              {v.l}
            </button>
          ))}
        </div>
        {view==="wdc"&&WDC.map((d,i)=>(
          <div key={d.id} style={{background:theme.card,borderRadius:14,padding:"12px 14px",border:`1px solid ${i<3?d.color+"44":theme.border}`,marginBottom:8,display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:4,background:d.color,borderRadius:2,alignSelf:"stretch",flexShrink:0}}/>
            <div style={{width:26,textAlign:"center",fontWeight:900,fontSize:16,color:posColor(i+1,theme),flexShrink:0}}>{i===0?"👑":i+1}</div>
            <div style={{width:34,height:34,borderRadius:9,background:d.color+"22",border:`1px solid ${d.color}44`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,color:d.color,fontSize:13,flexShrink:0}}>{d.num}</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:2}}>
                <span style={{fontWeight:800,color:theme.text,fontSize:14,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{d.short}</span>
                <span style={{fontSize:14}}>{d.nat}</span>
              </div>
              <div style={{fontSize:11,color:theme.muted,marginBottom:4}}>{d.team}</div>
              <div style={{height:3,background:theme.border,borderRadius:2,overflow:"hidden"}}><div style={{height:"100%",width:`${(d.pts/wdcLeader)*100}%`,background:d.color,borderRadius:2,transition:"width .3s"}}/></div>
            </div>
            <div style={{textAlign:"right",flexShrink:0}}>
              <div style={{fontWeight:900,fontSize:20,color:i===0?theme.accent:theme.text}}>{d.pts}</div>
              <div style={{fontSize:10,color:theme.muted,fontWeight:600}}>PTS</div>
            </div>
          </div>
        ))}
        {view==="wcc"&&WCC.map((c,i)=>(
          <div key={c.team} style={{background:theme.card,borderRadius:14,padding:"14px 16px",border:`1px solid ${i<3?c.color+"44":theme.border}`,marginBottom:8,display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:4,background:c.color,borderRadius:2,alignSelf:"stretch",flexShrink:0}}/>
            <div style={{width:26,textAlign:"center",fontWeight:900,fontSize:16,color:posColor(i+1,theme),flexShrink:0}}>{i===0?"👑":i+1}</div>
            <div style={{width:14,height:38,borderRadius:4,background:c.color,flexShrink:0}}/>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontWeight:800,color:theme.text,fontSize:15,marginBottom:4,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.team}</div>
              <div style={{height:3,background:theme.border,borderRadius:2,overflow:"hidden"}}><div style={{height:"100%",width:`${(c.pts/wdcLeader)*100}%`,background:c.color,borderRadius:2}}/></div>
            </div>
            <div style={{textAlign:"right",flexShrink:0}}>
              <div style={{fontWeight:900,fontSize:20,color:i===0?theme.accent:theme.text}}>{c.pts}</div>
              <div style={{fontSize:10,color:theme.muted,fontWeight:600}}>PTS</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SOCIAL PAGE (simplifiée)
═══════════════════════════════════════════════════════════ */
function SocialPage({ posts, setPosts, user, users, t, setTab, setViewProfile }) {
  const theme = t || THEMES.dark;
  const[text,setText]=useState("");
  const[tag,setTag]=useState("Race Day");
  const[form,setForm]=useState(false);
  const canPost=user?.role==="admin"||user?.role==="pilote";
  const displayPosts = posts.length ? posts : SEED_POSTS;

  const submit=()=>{
    if(!text.trim())return;
    const newPost = {
      id: Date.now(),
      authorId: user.id,
      pseudo: user.pseudo,
      av: user.av,
      color: user.color,
      team: user.team,
      num: user.num,
      time: "maintenant",
      tag,
      tagColor: POST_TAGS[tag],
      text,
      image: null,
      likes: [],
      comments: [],
      reported: false,
      mentions: []
    };
    setPosts([newPost, ...displayPosts]);
    setText("");
    setForm(false);
  };

  return (
    <div>
      <TopBar title="Réseau Pilotes" t={theme} right={canPost&&<button onClick={()=>setForm(!form)} style={{background:theme.grad,border:"none",borderRadius:10,padding:"7px 14px",color:"#fff",fontWeight:700,cursor:"pointer",fontSize:13,flexShrink:0,minHeight:36}}>✏️ Publier</button>}/>
      <div style={{padding:"14px 14px 0"}}>
        {form&&canPost&&(
          <div style={{background:theme.card,borderRadius:18,padding:16,marginBottom:14,border:`1px solid ${theme.accent}55`,boxShadow:theme.glow}}>
            <textarea value={text} onChange={e=>setText(e.target.value)} placeholder="Partage…" style={{width:"100%",minHeight:80,background:theme.inp,border:`1.5px solid ${theme.border}`,borderRadius:12,padding:12,color:theme.text,fontSize:16,outline:"none",resize:"vertical",boxSizing:"border-box",fontFamily:"inherit",marginBottom:10}}/>
            <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:12}}>
              {Object.entries(POST_TAGS).map(([tg,c])=>(
                <button key={tg} onClick={()=>setTag(tg)} style={{padding:"6px 12px",borderRadius:20,border:`1px solid ${tag===tg?c:theme.border}`,background:tag===tg?c+"22":"transparent",color:tag===tg?c:theme.muted,fontWeight:700,cursor:"pointer",fontSize:12,minHeight:36}}>
                  {tg}
                </button>
              ))}
            </div>
            <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
              <button onClick={()=>setForm(false)} style={{background:"none",border:`1px solid ${theme.border}`,borderRadius:10,padding:"10px 14px",cursor:"pointer",color:theme.muted,fontSize:13,fontWeight:600,minHeight:44}}>Annuler</button>
              <Btn onClick={submit} t={theme} disabled={!text.trim()}>Publier 🚀</Btn>
            </div>
          </div>
        )}
        {displayPosts.map(p=>(
          <div key={p.id} style={{background:theme.card,borderRadius:18,overflow:"hidden",border:`1px solid ${theme.border}`,marginBottom:12}}>
            <div style={{padding:"13px 14px",display:"flex",alignItems:"center",gap:11}}>
              <Av src={p.avatar} letter={p.av} color={p.color} size={42}/>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontWeight:800,color:theme.text,fontSize:15}}>{p.pseudo}</div>
                <div style={{fontSize:12,color:theme.muted}}>{p.team} · {p.time}</div>
              </div>
              <Chip label={p.tag} color={p.tagColor}/>
            </div>
            {p.text&&<div style={{padding:"0 14px 12px"}}><p style={{color:theme.text,fontSize:15,lineHeight:1.65,margin:0}}>{p.text}</p></div>}
            <div style={{padding:"10px 14px",borderTop:`1px solid ${theme.border}`,display:"flex",gap:16,alignItems:"center"}}>
              <span style={{color:theme.muted,fontSize:15}}>❤️ {p.likes.length}</span>
              <span style={{color:theme.muted,fontSize:15}}>💬 {p.comments.length}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MESSAGES PAGE (simplifiée)
═══════════════════════════════════════════════════════════ */
function MessagesPage({ messages, setMessages, user, users, t }) {
  const theme = t || THEMES.dark;
  const[activeConv,setActiveConv]=useState(null);
  const[newMsg,setNewMsg]=useState("");
  const msgEndRef=useRef(null);
  const myConvs = messages.length ? messages : SEED_MSGS;

  const getName=c=>{
    if(c.type==="group")return c.name||"Groupe";
    const other=c.participants.find(id=>id!==user?.id);
    const u=users.find(x=>x.id===other);
    return u?u.pseudo:"?";
  };

  const getAv=c=>{
    if(c.type==="group")return{letter:"👥",color:"#6b8aff",src:null};
    const other=c.participants.find(id=>id!==user?.id);
    const u=users.find(x=>x.id===other);
    return u?{letter:u.av,color:u.color,src:u.avatar}:{letter:"?",color:"#888",src:null};
  };

  const send=()=>{
    if(!newMsg.trim()||!activeConv)return;
    setMessages(myConvs.map(c=>c.id===activeConv?{...c,messages:[...c.messages,{id:Date.now(),from:user.id,text:newMsg,time:new Date().toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"})}]}:c));
    setNewMsg("");
    setTimeout(()=>msgEndRef.current?.scrollIntoView({behavior:"smooth"}),50);
  };

  const conv=myConvs.find(c=>c.id===activeConv);

  if (activeConv&&conv) {
    return (
      <div style={{display:"flex",flexDirection:"column",height:"calc(100dvh - 56px)"}}>
        <div style={{background:theme.nav,backdropFilter:"blur(20px)",borderBottom:`1px solid ${theme.border}`,padding:"env(safe-area-inset-top,0) 14px 0",flexShrink:0}}>
          <div style={{height:56,display:"flex",alignItems:"center",gap:10}}>
            <button onClick={()=>setActiveConv(null)} style={{background:"none",border:"none",cursor:"pointer",color:theme.accent,fontSize:14,fontWeight:700,display:"flex",alignItems:"center",gap:4,minHeight:44,minWidth:44}}>‹</button>
            {(()=>{const av=getAv(conv);return<Av src={av.src} letter={av.letter} color={av.color} size={34}/>;})()}
            <div style={{flex:1}}>
              <div style={{fontWeight:800,color:theme.text,fontSize:15}}>{getName(conv)}</div>
            </div>
          </div>
        </div>
        <div style={{flex:1,overflowY:"auto",padding:"14px",display:"flex",flexDirection:"column",gap:10}}>
          {conv.messages.map(m=>{
            const isMe=m.from===user.id;
            const sender=users.find(x=>x.id===m.from);
            return (
              <div key={m.id} style={{display:"flex",flexDirection:isMe?"row-reverse":"row",alignItems:"flex-end",gap:8}}>
                {!isMe&&<Av src={sender?.avatar} letter={sender?.av} color={sender?.color||"#888"} size={28}/>}
                <div style={{maxWidth:"75%"}}>
                  <div style={{background:isMe?theme.accent:theme.el,borderRadius:isMe?"18px 18px 4px 18px":"18px 18px 18px 4px",padding:"11px 15px"}}>
                    <div style={{fontSize:15,color:isMe?"#fff":theme.text,lineHeight:1.5}}>{m.text}</div>
                  </div>
                  <div style={{fontSize:11,color:theme.muted,marginTop:3,textAlign:isMe?"right":"left"}}>{m.time}</div>
                </div>
              </div>
            );
          })}
          <div ref={msgEndRef}/>
        </div>
        <div style={{padding:"10px 12px",paddingBottom:"calc(env(safe-area-inset-bottom,0px) + 66px)",borderTop:`1px solid ${theme.border}`,display:"flex",gap:8,background:theme.nav,backdropFilter:"blur(20px)"}}>
          <input value={newMsg} onChange={e=>setNewMsg(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Message…" style={{flex:1,background:theme.inp,border:`1px solid ${theme.border}`,borderRadius:24,padding:"12px 16px",color:theme.text,fontSize:16,outline:"none",fontFamily:"inherit",minHeight:48}}/>
          <button onClick={send} style={{background:theme.grad,border:"none",borderRadius:"50%",width:48,height:48,color:"#fff",fontWeight:700,cursor:"pointer",fontSize:20,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>→</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <TopBar title="Messages" t={theme}/>
      <div style={{padding:"14px 14px 0"}}>
        {myConvs.map(c=>{
          const av=getAv(c);
          return (
            <button key={c.id} onClick={()=>setActiveConv(c.id)} style={{width:"100%",display:"flex",alignItems:"center",gap:13,padding:"14px",borderRadius:16,border:`1px solid ${theme.border}`,cursor:"pointer",background:theme.card,marginBottom:8,textAlign:"left",minHeight:70}}>
              <Av src={av.src} letter={av.letter} color={av.color} size={46}/>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontWeight:700,color:theme.text,fontSize:15,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",marginBottom:3}}>{getName(c)}</div>
              </div>
              <span style={{color:theme.muted,fontSize:20}}>›</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   NOTIFICATIONS PAGE (simplifiée)
═══════════════════════════════════════════════════════════ */
function NotifPage({ notifs, setNotifs, user, t }) {
  const theme = t || THEMES.dark;
  const myNotifs = notifs.length ? notifs : SEED_NOTIFS;
  
  return (
    <div>
      <TopBar title="Notifications" t={theme}/>
      <div style={{padding:"14px 14px 0"}}>
        {myNotifs.map(n=>(
          <div key={n.id} style={{background:theme.card,borderRadius:14,padding:"14px",marginBottom:9,border:`1px solid ${n.read?theme.border:theme.accent+"55"}`,display:"flex",gap:12,alignItems:"flex-start",minHeight:60}}>
            <div style={{width:40,height:40,borderRadius:11,background:theme.accent+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{n.type==="mention"?"💬":n.type==="like"?"❤️":"🔔"}</div>
            <div style={{flex:1}}>
              <div style={{fontSize:14,color:theme.text,fontWeight:n.read?500:700,lineHeight:1.5}}><span style={{color:theme.accent}}>@{n.from}</span> {n.text}</div>
              <div style={{fontSize:12,color:theme.muted,marginTop:3}}>Il y a {n.time}</div>
            </div>
            {!n.read&&<div style={{width:9,height:9,background:theme.accent,borderRadius:"50%",flexShrink:0,marginTop:4}}/>}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   ANNOUNCEMENTS PAGE (simplifiée)
═══════════════════════════════════════════════════════════ */
function AnnouncementsPage({ anns, setAnns, user, t }) {
  const theme = t || THEMES.dark;
  const displayAnns = anns.length ? anns : SEED_ANNS;
  
  return (
    <div>
      <TopBar title="Annonces Officielles" t={theme}/>
      <div style={{padding:"14px 14px 0"}}>
        {displayAnns.map(a=>{
          const read=a.readBy?.includes(user?.id);
          return (
            <div key={a.id} style={{background:theme.card,borderRadius:16,padding:16,marginBottom:11,border:`1px solid ${read?theme.border:theme.accent+"55"}`,cursor:"pointer",boxShadow:read?"none":theme.glow,transition:"all .2s"}}>
              <div style={{display:"flex",gap:12}}>
                <div style={{width:44,height:44,borderRadius:12,background:a.pinned?theme.accent+"22":theme.el,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{a.pinned?"📌":"📣"}</div>
                <div style={{flex:1}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4,flexWrap:"wrap"}}>
                    <span style={{fontWeight:800,color:theme.text,fontSize:15}}>{a.title}</span>
                    {!read&&<div style={{width:8,height:8,background:theme.accent,borderRadius:"50%"}}/>}
                  </div>
                  <p style={{color:theme.sub,fontSize:14,margin:"0 0 7px",lineHeight:1.6}}>{a.body}</p>
                  <div style={{fontSize:12,color:theme.muted}}>@{a.author} · {a.time}</div>
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
   PROFILE PAGE (simplifiée)
═══════════════════════════════════════════════════════════ */
function ProfilePage({ user, posts, t }) {
  const theme = t || THEMES.dark;
  const mine=posts.filter(p=>p.authorId===user?.id);
  
  return (
    <div>
      <TopBar title="Mon Profil" t={theme}/>
      <div style={{padding:"14px 14px 0"}}>
        <div style={{background:theme.card,borderRadius:20,overflow:"hidden",marginBottom:14,border:`1px solid ${theme.border}`}}>
          <div style={{height:90,background:theme.grad,opacity:0.3}}/>
          <div style={{padding:"0 18px 18px"}}>
            <div style={{display:"flex",alignItems:"flex-end",gap:12,marginTop:-38,marginBottom:12}}>
              <Av src={user?.avatar} letter={user?.av} color={user?.color} size={72} style={{border:`3px solid ${theme.card}`}}/>
              <div style={{flex:1,paddingBottom:4,minWidth:0}}>
                <div style={{fontSize:18,fontWeight:900,color:theme.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{user?.pseudo}</div>
                <div style={{display:"flex",gap:7,marginTop:5,alignItems:"center"}}><RolePill role={user?.role} t={theme}/>{user?.nat&&<span style={{fontSize:18}}>{user.nat}</span>}</div>
              </div>
            </div>
            {user?.bio&&<p style={{color:theme.sub,fontSize:14,margin:"0 0 12px",lineHeight:1.6}}>{user.bio}</p>}
            <div style={{display:"flex",gap:9,flexWrap:"wrap"}}>
              {user?.num!=null&&<div style={{background:theme.el,borderRadius:10,padding:"9px 14px",border:`1px solid ${theme.border}`,textAlign:"center"}}><div style={{fontSize:16,fontWeight:900,color:theme.accent}}>#{user.num}</div><div style={{fontSize:10,color:theme.muted,fontWeight:600}}>N°</div></div>}
              {user?.team&&<div style={{background:theme.el,borderRadius:10,padding:"9px 14px",border:`1px solid ${theme.border}`,textAlign:"center"}}><div style={{fontSize:13,fontWeight:800,color:theme.text}}>{user.team}</div><div style={{fontSize:10,color:theme.muted,fontWeight:600}}>ÉCURIE</div></div>}
              <div style={{background:theme.el,borderRadius:10,padding:"9px 14px",border:`1px solid ${theme.border}`,textAlign:"center"}}><div style={{fontSize:16,fontWeight:900,color:theme.text}}>{mine.length}</div><div style={{fontSize:10,color:theme.muted,fontWeight:600}}>POSTS</div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   ADMIN PANEL (simplifié)
═══════════════════════════════════════════════════════════ */
function AdminPage({ posts, anns, t, user }) {
  const theme = t || THEMES.dark;
  
  return (
    <div>
      <TopBar title="Panneau Admin 👑" t={theme}/>
      <div style={{padding:"14px 14px 0"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:10,marginBottom:14}}>
          <div style={{background:theme.card,borderRadius:14,padding:"16px",border:`1px solid ${theme.border}`}}>
            <div style={{fontSize:22,marginBottom:5}}>📊</div>
            <div style={{fontSize:22,fontWeight:900,color:theme.text}}>{posts.length}</div>
            <div style={{fontSize:11,color:theme.muted,fontWeight:600}}>Posts</div>
          </div>
          <div style={{background:theme.card,borderRadius:14,padding:"16px",border:`1px solid ${theme.border}`}}>
            <div style={{fontSize:22,marginBottom:5}}>📢</div>
            <div style={{fontSize:22,fontWeight:900,color:theme.text}}>{anns.length}</div>
            <div style={{fontSize:11,color:theme.muted,fontWeight:600}}>Annonces</div>
          </div>
        </div>
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
  const[users,setUsers]=useState([]);
  const[tab,setTab]=useState("home");
  const[drawer,setDrawer]=useState(false);
  const[races,setRaces]=useState([]);
  const[posts,setPosts]=useState([]);
  const[anns,setAnns]=useState([]);
  const[messages,setMessages]=useState([]);
  const[notifs,setNotifs]=useState([]);
  const[viewProfile,setViewProfile]=useState(null);
  const t=THEMES[theme];

  const unread=anns.filter(a=>user&&!a.readBy?.includes(user.id)).length;
  const notifCount=notifs.filter(n=>!n.read&&(!n.targetId||n.targetId===user?.id)).length;
  const msgCount=messages.filter(c=>c.participants?.includes(user?.id)&&c.messages?.length>0&&c.messages[c.messages.length-1]?.from!==user?.id).length;

  // Charger les utilisateurs depuis Supabase ou utiliser les seed
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const { data } = await supabase.from('profiles').select('*');
        if (data && data.length) {
          setUsers(data.map(p=>({
            id:p.id,
            pseudo:p.username,
            role:p.role||"spectateur",
            firstName:p.display_name?.split(" ")[0]||"",
            lastName:p.display_name?.split(" ").slice(1).join(" ")||"",
            num:p.race_number||null,
            team:p.team||"Sans équipe",
            nat:p.nationality||"🇫🇷",
            color:p.color||AV_COLORS[0],
            av:p.username?.slice(0,2).toUpperCase() || "?",
            bio:p.bio||"",
            joined:"2025",
            avatar:p.avatar_url||null
          })));
        } else {
          setUsers(SEED_USERS);
        }
      } catch (e) {
        console.log("Using seed users");
        setUsers(SEED_USERS);
      }
    };
    loadUsers();
  }, []);

  const handleLogout=()=>{
    setUser(null);
    setTab("home");
  };

  if(!user) return <AuthScreen onLogin={setUser} t={t}/>;

  // Page content mapping
  const pageContent = {
    home:          <HomePage user={user} t={t} setTab={setTab} unread={unread} notifCount={notifCount} msgCount={msgCount}/>,
    results:       <ResultsPage races={races} t={t}/>,
    standings:     <StandingsPage t={t}/>,
    social:        <SocialPage posts={posts} setPosts={setPosts} user={user} users={users} t={t} setTab={setTab} setViewProfile={setViewProfile}/>,
    announcements: <AnnouncementsPage anns={anns} setAnns={setAnns} user={user} t={t}/>,
    messages:      <MessagesPage messages={messages} setMessages={setMessages} user={user} users={users} t={t}/>,
    notifications: <NotifPage notifs={notifs} setNotifs={setNotifs} user={user} t={t}/>,
    admin:         user?.role==="admin"?<AdminPage posts={posts} anns={anns} t={t} user={user}/>:null,
    profile:       <ProfilePage user={user} posts={posts} t={t}/>,
  };

  return (
    <div style={{height:"100dvh",background:t.bg,fontFamily:"'Segoe UI',system-ui,sans-serif",color:t.text,display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
        button, input, textarea, select { font-family: inherit; }
        ::-webkit-scrollbar { width: 3px; height: 3px; }
        ::-webkit-scrollbar-thumb { background: ${t.border}; border-radius: 2px; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
      `}</style>
      <div style={{flex:1,overflowY:"auto",overflowX:"hidden",paddingBottom:"calc(56px + env(safe-area-inset-bottom,0px))"}}>
        {pageContent[tab] || pageContent.home}
      </div>
      <BottomNav tab={tab} setTab={setTab} user={user} unread={unread} notifCount={notifCount} msgCount={msgCount} t={t} onMenuOpen={()=>setDrawer(true)}/>
      <Drawer open={drawer} onClose={()=>setDrawer(false)} user={user} tab={tab} setTab={setTab} theme={theme} setTheme={setTheme} unread={unread} notifCount={notifCount} t={t} onLogout={handleLogout}/>
    </div>
  );
}