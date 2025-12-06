import { LivelyCuteHouse } from './LivelyCuteHouse';

export default function Footer() {
  return (
    <footer className="bg-base-100 shadow-none mt-12 p-3 text-center text-neutral">
      <div className="flex flex-col items-center gap-2">
        <div className="text-sm font-medium">
          © 2025 <span className="text-primary font-bold">Sweet Home</span>{' '}
          <LivelyCuteHouse className="inline-block text-primary w-6 h-6" />
        </div>
      </div>
    </footer>
  );
}