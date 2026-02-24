

//  Profile Data
interface ProfileType {
  title: string;
  img: any;
  subtitle: string;
  url: string;
}

import acccountIcon from "/public/images/svgs/icon-account.svg";

const profileDD: ProfileType[] = [
  {
    img: acccountIcon,
    title: "ข้อมูลส่วนตัว",
    subtitle: "จัดการข้อมูลส่วนตัว",
    url: "/student/profile",
  },

];

export {
  profileDD,
};
