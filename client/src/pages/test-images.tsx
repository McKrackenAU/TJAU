export default function TestImages() {
  return (
    <div className="w-full max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Image Path Test</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-bold mb-4">Background Image Test</h2>
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold mb-2">/card-back.png</h3>
              <div 
                className="w-48 h-72 rounded-xl overflow-hidden"
                style={{ 
                  backgroundImage: 'url(/card-back.png)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              ></div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">/oracle-of-illusion.png</h3>
              <div 
                className="w-48 h-72 rounded-xl overflow-hidden"
                style={{ 
                  backgroundImage: 'url(/oracle-of-illusion.png)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              ></div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">/Oracle of Illusion.png (with encoding)</h3>
              <div 
                className="w-48 h-72 rounded-xl overflow-hidden"
                style={{ 
                  backgroundImage: 'url(/Oracle%20of%20Illusion.png)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              ></div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4">Image Tag Test</h2>
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold mb-2">/card-back.png</h3>
              <img 
                src="/card-back.png" 
                alt="Card Back"
                className="w-48 h-72 object-cover rounded-xl"
              />
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">/oracle-of-illusion.png</h3>
              <img 
                src="/oracle-of-illusion.png" 
                alt="Oracle of Illusion (Hyphen)"
                className="w-48 h-72 object-cover rounded-xl"
              />
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">/Oracle of Illusion.png (with encoding)</h3>
              <img 
                src="/Oracle%20of%20Illusion.png" 
                alt="Oracle of Illusion (Spaces)"
                className="w-48 h-72 object-cover rounded-xl"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}