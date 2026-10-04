const button = 'inline-block px-s py-2xs text-center text-14 font-bold rounded-8 cursor-pointer';
const smallButton = 'inline-block px-xs py-3xs text-center text-12 font-bold border rounded-8 cursor-pointer';

/**
 * ボタン・リンクの見た目 (Tailwind はビルド後の JS に書かれた文字列を走査するため、定数として定義できる)
 */
export const buttonStyles = {
  primary: `${button} text-white bg-blue-500 hover:bg-blue-600`,
  secondary: `${button} text-gray-700 bg-white border border-gray-300 hover:bg-gray-100`,
  nav: `${smallButton} text-gray-700 bg-white border-gray-300 hover:bg-gray-100`,
  edit: `${smallButton} text-blue-500 border-blue-500 hover:bg-blue-100`,
  danger: `${smallButton} text-red-500 border-red-500 hover:bg-red-100`,
};
