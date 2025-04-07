export default function CardBack() {
  // Using a div with background image instead of img tag
  return (
    <div 
      className="w-full h-full rounded-xl overflow-hidden border-2 border-white/10 bg-cover bg-center"
      style={{ 
        backgroundImage: 'url(/oracle-of-illusion.png)',
        backgroundColor: '#1a103c' // Fallback color
      }}
    >
    </div>
  );
}