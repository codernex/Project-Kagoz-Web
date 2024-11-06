import React from "react";

const CategoryItem = () => {
  return (
    <div className="py-[1rem] lg:py-[3.2rem] px-[2.4rem] bg-white rounded-sm flex flex-col items-center gap-y-[.5rem] lg:gap-y-[2rem]">
      <div className="h-[6rem] w-[6rem] lg:h-[8rem] lg:w-[8rem] rounded-full bg-[#6F00FF0D] flex items-center justify-center border-[1px] border-[#6F00FF33]">
        <svg
          className="w-[2rem] h-[2rem] lg:w-[4.2rem] lg:h-[2.8rem]"
          viewBox="0 0 42 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M41.8088 15.7377C41.4994 12.2649 40.9898 11.5886 40.7973 11.3342C40.3548 10.7464 39.6466 10.3623 38.8973 9.95922C38.8549 9.93681 38.8183 9.90486 38.7904 9.86589C38.7625 9.82692 38.744 9.782 38.7364 9.73466C38.7288 9.68733 38.7323 9.63888 38.7467 9.59314C38.761 9.5474 38.7858 9.50562 38.8191 9.47109C38.9578 9.33035 39.0645 9.16123 39.1317 8.97535C39.1989 8.78947 39.225 8.59124 39.2084 8.3943C39.176 8.04506 39.0136 7.72072 38.7534 7.48561C38.4931 7.25049 38.154 7.12178 37.8033 7.125H36.4626C36.4052 7.12534 36.3478 7.12907 36.2908 7.13617C36.2516 7.1192 36.2111 7.10568 36.1696 7.09578C35.3755 5.41742 34.2884 3.11945 32.0351 1.99797C28.693 0.335937 22.5365 0.25 21.3334 0.25C20.1302 0.25 13.9737 0.335937 10.6359 1.99539C8.38257 3.11687 7.29546 5.41484 6.5014 7.0932L6.49452 7.10695C6.45492 7.11252 6.41603 7.12232 6.37851 7.13617C6.32149 7.12907 6.26409 7.12534 6.20663 7.125H4.86343C4.51271 7.12178 4.17359 7.25049 3.91333 7.48561C3.65307 7.72072 3.49067 8.04506 3.45835 8.3943C3.44309 8.59079 3.47043 8.78826 3.5385 8.97321C3.60658 9.15816 3.71379 9.32623 3.8528 9.46594C3.88606 9.50046 3.91084 9.54224 3.92518 9.58799C3.93953 9.63373 3.94305 9.68217 3.93547 9.72951C3.92788 9.77684 3.9094 9.82177 3.88149 9.86074C3.85357 9.8997 3.81698 9.93165 3.7746 9.95406C3.02523 10.3597 2.31366 10.7438 1.87452 11.3291C1.68202 11.5869 1.17327 12.2598 0.863038 15.7325C0.691163 17.6867 0.665382 19.7097 0.800304 21.0125C1.08304 23.7195 1.61327 25.3558 1.63562 25.4237C1.71698 25.6707 1.86675 25.8896 2.06755 26.055C2.26834 26.2203 2.51191 26.3253 2.76999 26.3578V26.375C2.76999 26.7397 2.91486 27.0894 3.17272 27.3473C3.43058 27.6051 3.78032 27.75 4.14499 27.75H8.95749C9.32216 27.75 9.6719 27.6051 9.92976 27.3473C10.1876 27.0894 10.3325 26.7397 10.3325 26.375C11.0724 26.375 11.5872 26.2427 12.1329 26.1017C12.9207 25.8894 13.726 25.7482 14.5391 25.6798C17.1611 25.4297 19.7684 25.3438 21.3334 25.3438C22.8665 25.3438 25.589 25.4297 28.2152 25.6798C29.0315 25.7484 29.84 25.8902 30.6309 26.1034C31.1534 26.2375 31.6493 26.3612 32.3359 26.3741C32.3359 26.7388 32.4808 27.0886 32.7387 27.3464C32.9965 27.6043 33.3463 27.7491 33.7109 27.7491H38.5234C38.8881 27.7491 39.2378 27.6043 39.4957 27.3464C39.7536 27.0886 39.8984 26.7388 39.8984 26.3741V26.3638C40.1571 26.332 40.4014 26.2272 40.6029 26.0619C40.8043 25.8965 40.9546 25.6772 41.0362 25.4297C41.0586 25.3618 41.5888 23.7255 41.8716 21.0185C42.0065 19.7148 41.9824 17.6953 41.8088 15.7377ZM8.98671 8.26883C9.67421 6.80789 10.4605 5.15445 11.8605 4.4575C13.8834 3.45031 18.0763 2.99656 21.3334 2.99656C24.5904 2.99656 28.7833 3.44688 30.8062 4.4575C32.2062 5.15445 32.9891 6.80875 33.68 8.26883L33.7659 8.45531C33.8162 8.56148 33.8384 8.67875 33.8305 8.79593C33.8225 8.91312 33.7847 9.02632 33.7206 9.12474C33.6565 9.22315 33.5682 9.3035 33.4642 9.35811C33.3602 9.41273 33.244 9.43979 33.1266 9.43672C30.2709 9.35937 24.2552 9.11187 21.3334 9.11187C18.4115 9.11187 12.3959 9.36539 9.53585 9.44273C9.41843 9.44581 9.30219 9.41874 9.1982 9.36413C9.09421 9.30951 9.00595 9.22917 8.94184 9.13075C8.87772 9.03234 8.83989 8.91914 8.83195 8.80195C8.82401 8.68476 8.84622 8.56749 8.89648 8.46133C8.92655 8.39773 8.95835 8.33328 8.98671 8.26883ZM10.0119 15.112C8.53365 15.29 7.0459 15.3778 5.55694 15.375C4.64601 15.375 3.70671 15.1172 3.53226 14.3059C3.4128 13.7602 3.42569 13.4534 3.49015 13.1449C3.54429 12.8828 3.63023 12.692 4.05991 12.625C5.1771 12.4531 5.80187 12.6688 7.63062 13.2077C8.84319 13.5643 9.71804 14.0395 10.2165 14.4159C10.4666 14.6016 10.3334 15.0863 10.0119 15.112ZM29.0368 22.1589C27.9059 22.2878 25.644 22.2405 21.3591 22.2405C17.0743 22.2405 14.8133 22.2878 13.6823 22.1589C12.5153 22.0291 11.0277 20.9257 12.0435 19.9426C12.7198 19.2946 14.2976 18.8099 16.3988 18.5375C18.5 18.2651 19.3894 18.125 21.3505 18.125C23.3116 18.125 24.1109 18.2109 26.3023 18.5384C28.4937 18.8658 30.1497 19.3565 30.6576 19.9434C31.584 20.9953 30.203 22.0223 29.0368 22.1641V22.1589ZM39.1344 14.3051C38.9626 15.1198 38.0173 15.3741 37.1098 15.3741C35.5923 15.3745 34.0761 15.2867 32.5688 15.1112C32.3059 15.0862 32.1838 14.6248 32.4502 14.4151C32.9409 14.0292 33.8252 13.5634 35.0361 13.2068C36.8648 12.668 37.9193 12.4523 38.8251 12.6319C39.0459 12.6757 39.1628 12.9129 39.1766 13.0616C39.2372 13.4755 39.2229 13.897 39.1344 14.3059V14.3051Z"
            fill="#6F00FF"
          />
        </svg>
      </div>
      <h3 className=" text-sm lg:text-md font-semibold leading-[25.41px] text-black">
        Automotive
      </h3>
      <div className="border-[1px] border-[#6F00FF33] rounded-xl bg-[#6F00FF0D] w-[5rem] lg:w-[6.8rem] text-center h-[2.4rem] lg:h-[3.4rem] flex items-center justify-center">
        <p className="text-primary font-semibold text-xs lg:text-[1.8rem]">
          20+
        </p>
      </div>
    </div>
  );
};

export default CategoryItem;