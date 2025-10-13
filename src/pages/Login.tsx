import { useState } from "react";
import styles from "./Login.module.css";
import { useNavigate } from "react-router-dom";
export default function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className={styles.container}>
      <div className={styles.topHeader}>
        <div className={styles.leftHeader}>
          <div onClick={() => navigate("/home")}>
            <svg
              viewBox="0 0 413 122"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={styles.logo}
            >
              <path
                d="M143.609 3.42062H174.637C183.028 3.42062 189.479 4.07844 193.993 5.39818C198.503 6.7138 201.895 8.61734 204.164 11.1047C206.434 13.592 207.972 16.6056 208.773 20.1414C209.579 23.6812 209.982 29.1534 209.982 36.5703V46.8897C209.982 54.4504 209.201 59.9637 207.639 63.4296C206.076 66.8954 203.211 69.5513 199.042 71.4055C194.869 73.2597 189.417 74.1848 182.687 74.1848H174.419V121.897H143.613V3.42062H143.609ZM174.415 23.6895V53.8378C175.295 53.8872 176.047 53.9118 176.684 53.9118C179.513 53.9118 181.478 53.217 182.576 51.8274C183.674 50.4378 184.22 47.5475 184.22 43.1566V33.4251C184.22 29.3754 183.587 26.7401 182.317 25.5231C181.051 24.3021 178.415 23.6895 174.415 23.6895Z"
                fill="white"
              ></path>
              <path
                d="M249.644 3.42062V98.1867H268.379V121.897H218.838V3.42062H249.644Z"
                fill="white"
              ></path>
              <path
                d="M332.828 3.42062L350.445 121.893H318.961L317.308 100.6H306.29L304.44 121.893H272.589L288.303 3.42062H332.828ZM316.498 79.5994C314.94 66.18 313.374 49.5949 311.807 29.84C308.67 52.5263 306.697 69.1114 305.895 79.5994H316.498Z"
                fill="white"
              ></path>
              <path
                d="M412.317 3.42062L389.853 79.0115V121.893H361.312V79.0115L339.653 3.42062H367.956C372.379 26.5468 374.871 42.1082 375.438 50.1089C377.144 37.4706 380.006 21.9051 384.019 3.42062H412.317Z"
                fill="white"
              ></path>
              <path
                d="M49.9814 2.26533V120.737H20.4169V57.2215C20.4169 48.0491 20.199 42.5399 19.759 40.6816C19.3191 38.8274 18.1145 37.4254 16.137 36.4757C14.1594 35.526 9.75618 35.0491 2.92727 35.0491H0V21.235C14.2951 18.1597 25.149 11.8365 32.5658 2.26533H49.9814Z"
                fill="#BA1818"
              ></path>
              <path
                d="M125.206 100.543V120.741H60.1528L60.1693 103.836C79.4391 72.3224 90.8932 52.8223 94.5277 45.3315C98.1621 37.8448 99.9793 32.0026 99.9793 27.8049C99.9793 24.5857 99.4284 22.1806 98.3306 20.5977C97.2288 19.0149 95.5596 18.2214 93.3107 18.2214C91.0618 18.2214 89.3885 19.1012 88.2908 20.8568C87.1889 22.6123 86.6421 26.1028 86.6421 31.3201V42.5892H60.1528V38.2724C60.1528 31.6367 60.4941 26.4071 61.1766 22.5753C61.859 18.7477 63.5406 14.9776 66.2253 11.2692C68.9059 7.56073 72.3964 4.75681 76.6886 2.85326C80.9808 0.949718 86.1282 0 92.1308 0C103.885 0 112.778 2.91493 118.805 8.74479C124.828 14.5747 127.842 21.9545 127.842 30.8802C127.842 37.6598 126.148 44.834 122.756 52.3948C119.364 59.9555 109.378 76.0061 92.7886 100.547H125.206V100.543Z"
                fill="#BA1818"
              ></path>
            </svg>
          </div>
        </div>

        <div onClick={() => navigate("/home")}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className={styles.closeBtn}
          >
            <path d="M18 6 6 18"></path>
            <path d="m6 6 12 12"></path>
          </svg>
        </div>
      </div>

      <div className={styles.content}>
        <h1 className={styles.title}>Login</h1>

        <div className={styles.inputGroup}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            width="24px"
            height="24px"
          >
            <g clip-path="url(#Username_svg__a)">
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-width="2"
                d="M21 19s0 2-2 2H5c-2 0-2-2-1-5 2-2 5-4 8-4s5 1 8 4m-4-9a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"
              ></path>
            </g>
            <defs>
              <clipPath id="Username_svg__a">
                <path fill="#fff" d="M0 0h24v24H0z"></path>
              </clipPath>
            </defs>
          </svg>
          <input type="text" placeholder="Username" />
        </div>

        <div className={styles.inputGroup}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            width="24px"
            height="24px"
          >
            <g
              stroke="currentColor"
              stroke-width="2"
              clip-path="url(#Password_svg__a)"
            >
              <path d="M16 10V7.429C16 5.535 14.21 4 12 4S8 5.535 8 7.429V10"></path>
              <rect
                width="14"
                height="10"
                x="5"
                y="10"
                stroke-linejoin="round"
                rx="1"
              ></rect>
              <path stroke-linecap="round" d="M12 16v1"></path>
            </g>
            <defs>
              <clipPath id="Password_svg__a">
                <path fill="#fff" d="M0 0h24v24H0z"></path>
              </clipPath>
            </defs>
          </svg>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
          />
          <button
            className={styles.showPasswordBtn}
            onClick={() => setShowPassword(!showPassword)}
          >
            {!showPassword ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                width="24px"
                height="24px"
              >
                <g clip-path="url(#EyeShow_svg__a)">
                  <path
                    fill="currentColor"
                    d="m2 12-.97-.242a1 1 0 0 0 .042.613zm20 0 .923.385a1 1 0 0 0-.042-.86zm-19.03.242c.072-.287.326-.774.836-1.378A10.6 10.6 0 0 1 5.81 9.07C7.474 7.906 9.653 7 12 7V5C9.147 5 6.576 6.094 4.664 7.43a12.6 12.6 0 0 0-2.386 2.143c-.599.709-1.07 1.472-1.248 2.184l1.94.486ZM12 7c4.708 0 8.06 3.505 9.12 5.474l1.76-.948C21.609 9.162 17.693 5 12 5zm9.077 4.615a8.25 8.25 0 0 1-2.62 3.339C16.998 16.064 14.797 17 11.5 17v2c3.704 0 6.337-1.063 8.167-2.454a10.25 10.25 0 0 0 3.256-4.161zM11.5 17c-1.994 0-3.922-.78-5.487-1.88-1.58-1.113-2.677-2.472-3.085-3.491l-1.856.742c.592 1.481 1.996 3.122 3.79 4.384C6.672 18.03 8.994 19 11.5 19z"
                  ></path>
                  <circle
                    cx="12"
                    cy="12"
                    r="3"
                    stroke="currentColor"
                    stroke-width="2"
                  ></circle>
                </g>
                <defs>
                  <clipPath id="EyeShow_svg__a">
                    <path fill="#fff" d="M0 0h24v24H0z"></path>
                  </clipPath>
                </defs>
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                width="24px"
                height="24px"
              >
                <g clip-path="url(#EyeHide_svg__a)">
                  <path
                    fill="currentColor"
                    d="m2 12-.97-.242a1 1 0 0 0 .042.613zm20 0 .923.385a1 1 0 0 0-.042-.86zm-2.455-4.287a1 1 0 0 0-1.234 1.574zm-6.166 9.177a1 1 0 0 0 .242 1.985zM16.487 7l.859.512.57-.955-1.01-.465-.42.908ZM10 17.873l-.166.986.675.113.35-.587zm-7.03-5.63c.072-.288.326-.775.836-1.379A10.6 10.6 0 0 1 5.81 9.07C7.474 7.906 9.653 7 12 7V5C9.147 5 6.576 6.094 4.664 7.43a12.6 12.6 0 0 0-2.386 2.143c-.599.709-1.07 1.472-1.248 2.184zm15.341-2.956c1.382 1.083 2.343 2.322 2.808 3.187l1.762-.948c-.604-1.121-1.75-2.569-3.336-3.813L18.31 9.287Zm2.766 2.328c-.651 1.563-2.627 4.656-7.698 5.275l.242 1.985c5.974-.729 8.456-4.46 9.302-6.49zM12 7c1.505 0 2.869.355 4.068.908l.838-1.816A11.65 11.65 0 0 0 12 5zm-1.834 9.887c-1.735-.292-3.36-1.12-4.663-2.147-1.315-1.038-2.215-2.212-2.575-3.111l-1.856.742c.527 1.32 1.695 2.757 3.192 3.938 1.51 1.192 3.44 2.192 5.57 2.55zm5.462-10.4L9.141 17.36l1.718 1.025 6.487-10.873z"
                  ></path>
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-width="2"
                    d="M19 3 8 21"
                  ></path>
                  <path
                    stroke="currentColor"
                    stroke-width="2"
                    d="M12 15a3 3 0 1 1 2.5-4.659"
                  ></path>
                </g>
                <defs>
                  <clipPath id="EyeHide_svg__a">
                    <path fill="#fff" d="M0 0h24v24H0z"></path>
                  </clipPath>
                </defs>
              </svg>
            )}
          </button>
        </div>

        <div className={styles.actions}>
          <a href="#" className={styles.actionLink}>
            Forgot Password?
          </a>
          <button className={styles.actionBtn}>Login</button>
        </div>

        <div className={styles.footerActions}>
          <p className={styles.actionLink}>
            Don't have an account yet?  <div onClick={() => navigate("/register")}>Create Account</div>
          </p>
        </div>
      </div>
    </div>
  );
}
