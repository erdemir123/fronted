module.exports = {
    content: [
      './App.js', // Tailwind sınıflarını bu dosyada arayacak
      './screen/**/*.{js,jsx,ts,tsx}', // Bileşenlerdeki Tailwind sınıflarını da kullanacak
      './components/**/*.{js,jsx,ts,tsx}', // Bileşenlerdeki Tailwind sınıflarını da kullanacak
      './navigation/**/*.{js,jsx,ts,tsx}', // Bileşenlerdeki Tailwind sınıflarını da kullanacak
    ],
    theme: {
      extend: {},
    },
    plugins: [
     
    ]
  };
  