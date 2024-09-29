import {Component} from "@angular/core";

@Component({
  selector: 'fm-success-icon',
  standalone: true,
  template: `
    <svg width="46" height="40" viewBox="0 0 46 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="23" cy="20" r="20" fill="#B3C85F"/>
      <g filter="url(#filter0_d_191_533)">
        <path fill-rule="evenodd" clip-rule="evenodd"
              d="M34.1216 13.6707L21.7973 30.7419L12.2813 22.2287L14.9482 19.2476L21.154 24.7993L30.8784 11.3294L34.1216 13.6707Z"
              fill="white"/>
      </g>
      <defs>
        <filter id="filter0_d_191_533" x="12.2812" y="11.3293" width="22.8403" height="20.4126"
                filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                         result="hardAlpha"/>
          <feOffset dx="1" dy="1"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_191_533"/>
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_191_533" result="shape"/>
        </filter>
      </defs>
    </svg>
  `
})
export class FmSuccessIconComponent {}
