export default function GenieIllustration() {
  return (
    <div className="w-full h-full flex items-center justify-center relative">
      <img
        src="/image.png"
        alt="Genie"
        className="w-full h-auto max-w-md object-contain animate-float"
        style={{
          filter: 'drop-shadow(0 0 60px rgba(34, 197, 94, 0.9)) brightness(0) saturate(100%) invert(73%) sepia(55%) saturate(2663%) hue-rotate(92deg) brightness(98%) contrast(87%)'
        }}
      />
    </div>
  );
}
