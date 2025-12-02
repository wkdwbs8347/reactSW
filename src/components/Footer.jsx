import { LivelyCuteHouse } from './LivelyCuteHouse';

export default function Footer() {
  return (
    <footer className="bg-transparent shadow-none mt-12 p-3 text-center text-gray-700">
      <div className="flex flex-col items-center gap-2">
        <div className="text-sm font-medium">
          © 2025 <span className="text-purple-600 font-bold">Sweet Home</span> <LivelyCuteHouse size="w-6 h-6"/>
        </div>
      </div>
    </footer>
  );
}