import {Component} from "@angular/core";

@Component({
  selector: 'sw-modal-basic-warning-icon',
  standalone: true,
  template: `
    <svg width="46" height="41" viewBox="0 0 46 41" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M19.727 2.87165L0.605008 34.952C-0.984263 37.6183 0.936932 41 4.04093 41H41.5895C44.6648 41 46.5898 37.6744 45.0581 35.0077L26.6314 2.92739C25.1081 0.275309 21.2929 0.244508 19.727 2.87165Z"
        fill="#FFCC19"/>
      <g filter="url(#filter0_d_191_531)">
        <path
          d="M21.7646 29.4629L20.6953 18.5645V13.5254H25.1484V18.5645L24.0938 29.4629H21.7646ZM20.8711 35V30.8838H24.9873V35H20.8711Z"
          fill="white"/>
      </g>
      <defs>
        <filter id="filter0_d_191_531" x="20.6953" y="13.5254" width="5.45312" height="22.4746"
                filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                         result="hardAlpha"/>
          <feOffset dx="1" dy="1"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_191_531"/>
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_191_531" result="shape"/>
        </filter>
      </defs>
    </svg>
  `
})
export class ModalBasicWarningIconComponent {}
