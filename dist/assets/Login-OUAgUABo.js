import{r as g,u as j,A as b,j as e,z as c}from"./index-Bx7bUBXK.js";import{aJ as o,aM as p,aQ as y,aR as w,B as I,aO as x,aP as v}from"./auth.service-DOZ4gYwF.js";const R="/assets/logo-CFYHPM8X.png",L="/assets/banner-CdUX-T2J.png",M=()=>{const[h,n]=g.useState(!1),i=j(),{setUser:m}=g.useContext(b),u=async t=>{var l,d;n(!0);try{const s=await x.login({userId:t.userId,password:t.password}),{authToken:a,role:r}=s.data.data;v.set("MLM",a,{expires:30});const f=(await x.getProfile()).data.data.user;m(f),c.success("Login successful"),i(r==="Admin"?"/admin/dashboard":r==="Customer"?"/customer/dashboard":r==="Distributor"?"/distributor/dashboard":"/login")}catch(s){const a=((d=(l=s==null?void 0:s.response)==null?void 0:l.data)==null?void 0:d.message)||"Invalid credentials";c.error(a)}finally{n(!1)}};return e.jsxs(e.Fragment,{children:[e.jsx("style",{children:`
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
      `}),e.jsxs("div",{className:"login-wrapper",children:[e.jsx("div",{className:"login-left",children:e.jsx("img",{src:L,alt:"MLM Illustration"})}),e.jsxs("div",{className:"login-right",children:[e.jsx("div",{className:"login-logo",children:e.jsx("img",{src:R,alt:"SECI Logo"})}),e.jsxs("div",{className:"login-card",children:[e.jsx("h2",{children:"Login"}),e.jsx("p",{children:"Sign in to your account"}),e.jsxs(o,{layout:"vertical",onFinish:u,size:"middle",requiredMark:!1,children:[e.jsx(o.Item,{name:"userId",label:e.jsxs("span",{style:{fontWeight:600},children:["User",e.jsx("span",{style:{color:"red",marginRight:4},children:"*"})]}),rules:[{required:!0,message:"Please enter user ID"}],style:{marginBottom:16},children:e.jsx(p,{placeholder:"Enter user ID",autoComplete:"username",style:{height:42,borderRadius:6}})}),e.jsx(o.Item,{name:"password",label:e.jsxs("span",{style:{fontWeight:600},children:["Password",e.jsx("span",{style:{color:"red",marginRight:4},children:"*"})]}),rules:[{required:!0,message:"Please enter password"}],style:{marginBottom:24},children:e.jsx(p.Password,{placeholder:"Enter password",style:{height:42,borderRadius:6},iconRender:t=>t?e.jsx(y,{}):e.jsx(w,{}),autoComplete:"current-password"})}),e.jsx(o.Item,{style:{marginBottom:0},children:e.jsx(I,{type:"primary",htmlType:"submit",loading:h,block:!0,style:{background:"#042954",borderColor:"#042954",fontWeight:600,height:44,borderRadius:8,fontSize:15},children:"Login"})})]})]})]})]})]})};export{M as default};
