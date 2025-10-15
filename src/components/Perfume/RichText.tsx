// components/RichText.tsx
interface RichTextProps {
  titleParts?: {
    text: string;
    color?: string;
    underline?: boolean;
  }[];
  title?: string;
  description?: string;
  descriptionParts?: {
    text: string;
    color?: string;
  }[];
  titleColor?: string;
  textColor?: string;
  bgColor?: string;
}

export default function RichText({
  titleParts,
  title,
  description,
  descriptionParts,
  titleColor = '#242424',
  textColor = '#242424',
  bgColor = '#fcf9ee',
}: RichTextProps) {
  return (
    <section
      className="py-7 md:py-15 px-6" 
      style={{ backgroundColor: bgColor }}
    >
      <div className="max-w-[1400px] mx-auto">
        <div className="text-center">
          <h2 className="text-2xl md:text-4xl font-heading leading-tight mb-4 uppercase">
            {titleParts ? (
              titleParts.map((part, index) => (
                <span
                  key={index}
                  className={part.underline ? 'relative inline-block' : 'inline-block'}
                  style={{ color: part.color || titleColor , marginLeft: '10px' }}
                >
                  {part.text}
                  {part.underline && (
                    <span className="absolute bottom-[-6px] left-0 w-full h-[10px] pointer-events-none" style={{ display: 'block' }}>
                      <svg
                        width="100%"
                        height="12"
                        viewBox="0 0 100 12"
                        preserveAspectRatio="none"
                        style={{ display: 'block' }}
                      >
                        <path
                          d="M2,8 Q20,13 35,8 Q50,3 65,8 Q80,13 98,8"
                          stroke={part.color || '#ff5900'}
                          strokeWidth="3"
                          fill="none"
                          strokeLinecap="round"
                          style={{
                            filter: 'drop-shadow(0 1px 0 #fff4)'
                          }}
                        />
                      </svg>
                    </span>
                  )}
                </span>
              ))
            ) : (
              <span style={{ color: titleColor }}>{title}</span>
            )}
          </h2>

          <div className="text-base leading-relaxed max-w-3xl mx-auto">
            {descriptionParts ? (
              <p>
                {descriptionParts.map((part, index) => (
                  <span
                    key={index}
                    style={{ color: part.color || textColor }}
                  >
                    {part.text}
                  </span>
                ))}
              </p>
            ) : (
              <p style={{ color: textColor }}>{description}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}