import{r as d,u as j,A as y,j as e,z as g}from"./index-BXkrgXsa.js";import{aP as w,aJ as t,aM as c,aR as b,aS as I,B as v,aO as p,aQ as R}from"./logo-6gVRj_01.js";const L="/assets/banner-C1E2PXBj.png",P=()=>{const[x,o]=d.useState(!1),r=j(),{setUser:h}=d.useContext(y),m=async i=>{var n,l;o(!0);try{const s=await p.login({userId:i.userId,password:i.password}),{authToken:a,role:u}=s.data.data;R.set("NovoraAiChat",a,{expires:30});const f=(await p.getProfile()).data.data.user;h(f),g.success("Login successful"),r(u==="Admin"?"/admin/dashboard":"/login")}catch(s){const a=((l=(n=s==null?void 0:s.response)==null?void 0:n.data)==null?void 0:l.message)||"Invalid credentials";g.error(a)}finally{o(!1)}};return e.jsxs(e.Fragment,{children:[e.jsx("style",{children:`
        .login-wrapper {
          min-height: 100vh;
          display: flex;
          flex-direction: row;
        }

        /* LEFT PANEL */
        .login-left {
          flex: 1;
          background: #011747;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          min-width: 0;
        }
        .login-left img {
          width: 100%;
          height: 100vh;
          object-fit: contain;
        }

        /* RIGHT PANEL */
        .login-right {
          flex: 1;
          min-width: 0;
          background: #f5f6f8;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 40px 24px;
          position: relative;
        }

        /* Logo */
        .login-logo {
          position: absolute;
          top: 88px;
          right: 106px;
        }
        .login-logo img {
          height: 44px;
        }

        /* Card */
        .login-card {
          width: 100%;
          max-width: 420px;
          background: #fff;
          padding: 40px 36px;
          border-radius: 10px;
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.09);
        }

        .login-card h2 {
          font-weight: 700;
          color: #042954;
          margin-bottom: 4px;
          font-size: 26px;
        }
        .login-card p {
          color: #6c757d;
          margin-bottom: 28px;
          font-size: 14px;
        }

        /* ── Tablet (≤ 900px): hide left panel ── */
        @media (max-width: 900px) {
          .login-left {
            display: none;
          }
          .login-right {
            flex: unset;
            width: 100%;
            min-height: 100vh;
          }
        }

        /* ── Mobile (≤ 480px): tighter card padding ── */
        @media (max-width: 480px) {
          .login-right {
            padding: 24px 16px;
          }
          .login-card {
            padding: 28px 20px;
            border-radius: 8px;
          }
          .login-card h2 {
            font-size: 22px;
          }
          .login-logo {
            top: 16px;
            right: 16px;
          }
          .login-logo img {
            height: 36px;
          }
        }

        /* ── Very small screens (≤ 360px) ── */
        @media (max-width: 360px) {
          .login-card {
            padding: 24px 14px;
          }
        }
      `}),e.jsxs("div",{className:"login-wrapper",children:[e.jsx("div",{className:"login-left",children:e.jsx("img",{src:L,alt:"MLM Illustration"})}),e.jsxs("div",{className:"login-right",children:[e.jsx("div",{className:"login-logo",children:e.jsx("img",{src:w,alt:"SECI Logo"})}),e.jsxs("div",{className:"login-card",children:[e.jsx("h2",{children:"Login"}),e.jsx("p",{children:"Sign in to your account"}),e.jsxs(t,{layout:"vertical",onFinish:m,size:"middle",requiredMark:!1,children:[e.jsx(t.Item,{name:"userId",label:e.jsxs("span",{style:{fontWeight:600},children:["User",e.jsx("span",{style:{color:"red",marginRight:4},children:"*"})]}),rules:[{required:!0,message:"Please enter user ID"}],style:{marginBottom:16},children:e.jsx(c,{placeholder:"Enter user ID",autoComplete:"username",style:{height:42,borderRadius:6}})}),e.jsx(t.Item,{name:"password",label:e.jsxs("span",{style:{fontWeight:600},children:["Password",e.jsx("span",{style:{color:"red",marginRight:4},children:"*"})]}),rules:[{required:!0,message:"Please enter password"}],style:{marginBottom:24},children:e.jsx(c.Password,{placeholder:"Enter password",style:{height:42,borderRadius:6},iconRender:i=>i?e.jsx(b,{}):e.jsx(I,{}),autoComplete:"current-password"})}),e.jsx(t.Item,{style:{marginBottom:0},children:e.jsx(v,{type:"primary",htmlType:"submit",loading:x,block:!0,style:{background:"#042954",borderColor:"#042954",fontWeight:600,height:44,borderRadius:8,fontSize:15},children:"Login"})})]})]})]})]})]})};export{P as default};
