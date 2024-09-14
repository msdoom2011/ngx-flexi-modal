import {Component} from "@angular/core";

@Component({
  selector: 'sw-modal-basic-error-icon',
  standalone: true,
  template: `
    <svg width="46" height="40" viewBox="0 0 46 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="23" cy="20" r="20" fill="#F47373"/>
      <g filter="url(#filter0_d_191_534)">
        <path fill-rule="evenodd" clip-rule="evenodd"
              d="M20.5687 20L14.6353 14.4621L17.3645 11.5378L23.4999 17.2642L29.6353 11.5378L32.3645 14.4621L26.4311 20L32.3645 25.5378L29.6353 28.4621L23.4999 22.7357L17.3645 28.4621L14.6353 25.5378L20.5687 20Z"
              fill="white"/>
      </g>
      <defs>
        <filter id="filter0_d_191_534" x="14.6353" y="11.5378" width="18.7292" height="17.9243"
                filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                         result="hardAlpha"/>
          <feOffset dx="1" dy="1"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_191_534"/>
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_191_534" result="shape"/>
        </filter>
      </defs>
    </svg>
  `
})
export class ModalBasicErrorIconComponent {}
