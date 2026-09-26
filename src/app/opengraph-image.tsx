import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'AIZORA — Best Clothing Brand for Women | aizorastyle.in';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #f5f0eb 0%, #e8ddd0 40%, #c9a98a 100%)',
          fontFamily: 'serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background geometric elements */}
        <div
          style={{
            position: 'absolute',
            top: -60,
            right: -60,
            width: 320,
            height: 320,
            borderRadius: '50%',
            background: 'rgba(201,169,138,0.2)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -80,
            left: -80,
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'rgba(201,169,138,0.15)',
          }}
        />

        {/* Top accent line */}
        <div
          style={{
            position: 'absolute',
            top: 50,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 60,
            height: 2,
            background: '#9B7355',
          }}
        />

        {/* Main Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '0 80px',
            zIndex: 1,
          }}
        >
          {/* Brand tagline */}
          <div
            style={{
              fontSize: 13,
              letterSpacing: '0.35em',
              textTransform: 'uppercase',
              color: '#9B7355',
              fontWeight: 700,
              marginBottom: 24,
            }}
          >
            WEAR YOUR ELEGANCE
          </div>

          {/* Brand Name */}
          <div
            style={{
              fontSize: 110,
              fontWeight: 900,
              color: '#3D2B1F',
              letterSpacing: '0.3em',
              lineHeight: 1,
              textTransform: 'uppercase',
              marginBottom: 20,
            }}
          >
            AIZORA
          </div>

          {/* Divider */}
          <div
            style={{
              width: 120,
              height: 1,
              background: '#9B7355',
              marginBottom: 24,
            }}
          />

          {/* Subtitle */}
          <div
            style={{
              fontSize: 22,
              color: '#6B4F3B',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              fontWeight: 400,
              marginBottom: 12,
            }}
          >
            India's Premier Women's Clothing Brand
          </div>

          {/* Description */}
          <div
            style={{
              fontSize: 16,
              color: '#9B7355',
              letterSpacing: '0.05em',
              maxWidth: 600,
              lineHeight: 1.6,
            }}
          >
            Handcrafted Ethnic Wear · Designer Co-ord Sets · Cotton Kurti Sets · Plus Size Fashion
          </div>

          {/* Domain Badge */}
          <div
            style={{
              marginTop: 36,
              padding: '10px 28px',
              border: '1px solid #9B7355',
              borderRadius: 2,
              fontSize: 14,
              letterSpacing: '0.18em',
              color: '#6B4F3B',
              textTransform: 'uppercase',
            }}
          >
            aizorastyle.in
          </div>
        </div>

        {/* Bottom accent */}
        <div
          style={{
            position: 'absolute',
            bottom: 50,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 60,
            height: 2,
            background: '#9B7355',
          }}
        />
      </div>
    ),
    { ...size }
  );
}
