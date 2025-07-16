export default function CardBack() {
  // Using Oracle of Illusion deck artwork as the universal card back
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