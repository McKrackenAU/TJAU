export default function CardBack() {
  // Using "Oracle of Illusion.png" with proper URL encoding
  return (
    <div 
      className="w-full h-full rounded-xl overflow-hidden border-2 border-white/10 bg-cover bg-center"
      style={{ 
        backgroundImage: 'url(/Oracle%20of%20Illusion.png)',
        backgroundColor: '#1a103c' // Fallback color
      }}
    >
    </div>
  );
}