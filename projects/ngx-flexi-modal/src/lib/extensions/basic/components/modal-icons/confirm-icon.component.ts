import {Component} from "@angular/core";

@Component({
  selector: 'fm-confirm-icon',
  standalone: true,
  template: `
    <svg width="46" height="40" viewBox="0 0 46 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="23" cy="20" r="20" fill="#88BEC9"/>
      <g filter="url(#filter0_d_193_961)">
        <path
          d="M24.8008 24.5703H21.8125C21.8047 24.1406 21.8008 23.8789 21.8008 23.7852C21.8008 22.8164 21.9609 22.0195 22.2812 21.3945C22.6016 20.7695 23.2422 20.0664 24.2031 19.2852C25.1641 18.5039 25.7383 17.9922 25.9258 17.75C26.2148 17.3672 26.3594 16.9453 26.3594 16.4844C26.3594 15.8438 26.1016 15.2969 25.5859 14.8438C25.0781 14.3828 24.3906 14.1523 23.5234 14.1523C22.6875 14.1523 21.9883 14.3906 21.4258 14.8672C20.8633 15.3438 20.4766 16.0703 20.2656 17.0469L17.2422 16.6719C17.3281 15.2734 17.9219 14.0859 19.0234 13.1094C20.1328 12.1328 21.5859 11.6445 23.3828 11.6445C25.2734 11.6445 26.7773 12.1406 27.8945 13.1328C29.0117 14.1172 29.5703 15.2656 29.5703 16.5781C29.5703 17.3047 29.3633 17.9922 28.9492 18.6406C28.543 19.2891 27.668 20.1719 26.3242 21.2891C25.6289 21.8672 25.1953 22.332 25.0234 22.6836C24.8594 23.0352 24.7852 23.6641 24.8008 24.5703ZM21.8125 29V25.707H25.1055V29H21.8125Z"
          fill="white"/>
      </g>
      <defs>
        <filter id="filter0_d_193_961" x="17.2422" y="11.6445" width="13.3281" height="18.3555"
                filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                         result="hardAlpha"/>
          <feOffset dx="1" dy="1"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_193_961"/>
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_193_961" result="shape"/>
        </filter>
      </defs>
    </svg>
  `
})
export class ConfirmIconComponent {}
