'use client';

const IslamicPattern = ({ className = "", opacity = 0.1 }) => {
  return (
    <div className={`absolute inset-0 ${className}`} style={{ opacity }}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 400 400"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          <pattern
            id="islamic-pattern"
            x="0"
            y="0"
            width="100"
            height="100"
            patternUnits="userSpaceOnUse"
          >
            {/* Central Star */}
            <g transform="translate(50,50)">
              <polygon
                points="0,-20 6,-6 20,-6 10,2 16,16 0,8 -16,16 -10,2 -20,-6 -6,-6"
                fill="currentColor"
                opacity="0.6"
              />
              <circle cx="0" cy="0" r="4" fill="currentColor" opacity="0.8" />
            </g>
            
            {/* Corner Elements */}
            <g transform="translate(0,0)">
              <path
                d="M0,0 Q25,0 25,25 Q0,25 0,0"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                opacity="0.4"
              />
            </g>
            <g transform="translate(100,0) rotate(90)">
              <path
                d="M0,0 Q25,0 25,25 Q0,25 0,0"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                opacity="0.4"
              />
            </g>
            <g transform="translate(100,100) rotate(180)">
              <path
                d="M0,0 Q25,0 25,25 Q0,25 0,0"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                opacity="0.4"
              />
            </g>
            <g transform="translate(0,100) rotate(270)">
              <path
                d="M0,0 Q25,0 25,25 Q0,25 0,0"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                opacity="0.4"
              />
            </g>
            
            {/* Connecting Lines */}
            <line x1="25" y1="0" x2="75" y2="0" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
            <line x1="100" y1="25" x2="100" y2="75" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
            <line x1="75" y1="100" x2="25" y2="100" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
            <line x1="0" y1="75" x2="0" y2="25" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
          </pattern>
        </defs>
        
        <rect width="100%" height="100%" fill="url(#islamic-pattern)" />
      </svg>
    </div>
  );
};

export default IslamicPattern;