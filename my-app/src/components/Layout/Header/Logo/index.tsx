import Image from "next/image";
import Link from "next/link";
import LogoImg from "../../../../../public/images/amalwalletlogo.png";


const Logo: React.FC = () => {
  return (
    <Link href="/">
      <Image
        src={LogoImg}
        alt="logo"
        width={160}
        height={50}
        // style={{ filter: "invert(100%)" }}
        quality={100}
      />
    </Link>
  );
};

export default Logo;
