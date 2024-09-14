import {Component} from "@angular/core";

@Component({
  selector: 'sw-modal-basic-info-icon',
  standalone: true,
  template: `
    <svg width="46" height="40" viewBox="0 0 46 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="23" cy="20" r="20" fill="#65AADC"/>
      <g filter="url(#filter0_d_191_532)">
        <path
          d="M20.9864 12.3519V9H25.0952V12.3519H20.9864ZM25.0952 15.4346V27.2404L27 27.6442V30H19.2041V27.6442L21.1224 27.2404V18.2077L19 17.8038V15.4346H25.0952Z"
          fill="white"/>
      </g>
      <defs>
        <filter id="filter0_d_191_532" x="19" y="9" width="9" height="22" filterUnits="userSpaceOnUse"
                color-interpolation-filters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                         result="hardAlpha"/>
          <feOffset dx="1" dy="1"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_191_532"/>
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_191_532" result="shape"/>
        </filter>
      </defs>
    </svg>
  `
})
export class ModalBasicInfoIconComponent {}
