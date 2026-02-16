import Image from 'next/image';

export default function Logo() {
  return (
    <div className="flex justify-center">
      <Image
        src="/logo-enri.PNG"
        alt="DJ QR Logo"
        width={200}
        height={38}
        priority
        className="object-contain"
      />
    </div>
  );
}
