import Image from "next/image";
import { Github, Linkedin, Download, Mail } from "lucide-react";
import Reveal from "@/components/reveal";
import BlurText from "@/components/reactbits/blur-text";

export default function Hero() {
  return (
    <section className="flex items-center  justify-center max-w-6xl mx-auto min-h-screen px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      <div className="max-w-6xl w-full">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          {/* Left Content */}
          <div className="flex-1 max-w-2xl text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
              <BlurText
                text="Full-Stack Web Developer 👋🏻"
                delay={120}
                animateBy="words"
                direction="top"
                className="justify-center lg:justify-start"
              />
            </h1>

            <Reveal delay={0.1}>
              <p className="text-base sm:text-lg text-muted-foreground mb-8 leading-relaxed">
                Rayan Khan — Full-Stack Developer turning ideas into web
                experiences.
                <br />
                Lifelong learner | Based in Peshawar, Pakistan 🇵🇰
              </p>
            </Reveal>

            {/* Social Icons */}
            <Reveal
              delay={0.2}
              className="flex justify-center lg:justify-start items-center gap-3 mb-8"
            >
              <a
                href="https://linkedin.com/in/rayankhanwebdev"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 flex items-center justify-center hover:scale-110 transition-transform"
              >
                <Linkedin className="w-6 h-6 text-foreground" />
              </a>
              <a
                href="https://github.com/rayankhan2003"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 flex items-center justify-center hover:scale-110 transition-transform"
              >
                <Github className="w-6 h-6 text-foreground" />
              </a>
            </Reveal>

            {/* Buttons */}
            <Reveal
              delay={0.3}
              className="flex flex-wrap justify-center lg:justify-start gap-4 mb-16"
            >
              <a
                target="_blank"
                href="https://mail.google.com/mail/?view=cm&to=rayan4khan1@gmail.com"
                className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors text-sm sm:text-base"
              >
                <Mail className="w-4 h-4" />
                Contact Me
              </a>
              <a
                href="/rayan-cv.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 border-2 border-foreground text-foreground px-6 py-3 rounded-lg hover:bg-foreground hover:text-background transition-colors text-sm sm:text-base"
              >
                <Download className="w-4 h-4" />
                Download CV
              </a>
            </Reveal>

            {/* Tech Stack */}
            <Reveal
              delay={0.45}
              className="flex flex-col lg:flex-row items-center lg:items-start gap-8"
            >
              {/* Title + Divider */}
              <div className="flex items-center gap-4 mt-1">
                <span className="whitespace-nowrap text-base sm:text-lg font-medium text-muted-foreground">
                  ⚡ Tech I work with
                </span>
                <div className="hidden sm:block w-px h-6 bg-border"></div>
              </div>

              {/* Icons */}
              <div className="flex flex-wrap justify-center lg:justify-start items-center gap-6 sm:gap-10">
                {/* HTML */}
                <svg
                  className="w-7 h-7 sm:w-8 sm:h-8"
                  viewBox="0 0 100 100"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M14.0214 90.034L6 0H94.1867L86.1653 89.9854L50.0204 100"
                    fill="#E44D26"
                  />
                  <path
                    d="M50.093 92.344V7.39014H86.1407L79.2617 84.201"
                    fill="#F16529"
                  />
                  <path
                    d="M22.3831 18.4009H50.0933V29.4364H34.4881L35.509 40.7392H50.0933V51.7504H25.3972L22.3831 18.4009ZM25.8833 57.2925H36.9674L37.7452 66.116L50.0933 69.4218V80.9434L27.439 74.6235"
                    fill="#EBEBEB"
                  />
                  <path
                    d="M77.7058 18.4009H50.0442V29.4364H76.6849L77.7058 18.4009ZM75.6883 40.7392H50.0442V51.7747H63.6562L62.368 66.116L50.0442 69.4218V80.8948L72.6499 74.6235"
                    fill="white"
                  />
                </svg>
                {/* CSS */}
                <svg
                  className="w-7 h-7 sm:w-8 sm:h-8"
                  viewBox="0 0 100 100"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M94.1749 0L86.142 89.9895L50.0335 100L14.0245 90.0036L6 0H94.1749Z"
                    fill="#264DE4"
                  />
                  <path
                    d="M79.2648 84.2593L86.1295 7.35913H50.0874V92.3484L79.2648 84.2593Z"
                    fill="#2965F1"
                  />
                  <path
                    d="M24.396 40.7402L25.3854 51.7787H50.0876V40.7402H24.396Z"
                    fill="#EBEBEB"
                  />
                  <path
                    d="M50.0875 18.3977H22.408L23.4114 29.4364H50.0875V18.3977Z"
                    fill="#EBEBEB"
                  />
                  <path
                    d="M50.0874 80.8931V69.4083L37.7453 66.1016L36.9594 57.2979H25.8784L27.4249 74.63L50.0366 80.9072L50.0874 80.8931Z"
                    fill="#EBEBEB"
                  />
                  <path
                    d="M63.6421 51.7785L62.3608 66.0947L50.0493 69.4177V80.9019L72.679 74.6301L75.7083 40.7401H50.0493V51.7785H63.6421Z"
                    fill="white"
                  />
                </svg>
                {/* JavaScript */}
                <svg
                  className="w-7 h-7 sm:w-8 sm:h-8"
                  viewBox="0 0 100 100"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M100 0H0V100H100V0Z" fill="#F7DF1E" />
                  <path
                    d="M67.1745 78.1254C69.1888 81.4143 71.8094 83.8318 76.4444 83.8318C80.338 83.8318 82.8253 81.8857 82.8253 79.1969C82.8253 75.9746 80.2698 74.8334 75.9841 72.9588L73.6348 71.9508C66.8539 69.0619 62.3491 65.4429 62.3491 57.7921C62.3491 50.7445 67.719 45.3794 76.111 45.3794C82.0856 45.3794 86.3809 47.4588 89.4761 52.9032L82.1586 57.6016C80.5475 54.7127 78.8094 53.5746 76.111 53.5746C73.3587 53.5746 71.6142 55.3207 71.6142 57.6016C71.6142 60.4207 73.3602 61.5619 77.392 63.308L79.7412 64.3143C87.7253 67.7381 92.2333 71.2286 92.2333 79.0762C92.2333 87.5365 85.5872 92.1715 76.6618 92.1715C67.9348 92.1715 62.2967 88.0127 59.538 82.5619L67.1745 78.1254Z"
                    fill="black"
                  />
                </svg>
                {/* React */}
                <svg
                  className="w-7 h-7 sm:w-8 sm:h-8"
                  viewBox="0 0 101 100"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M50.3067 58.8163C55.1758 58.8163 59.1229 54.8691 59.1229 50.0001C59.1229 45.131 55.1758 41.1838 50.3067 41.1838C45.4376 41.1838 41.4905 45.131 41.4905 50.0001C41.4905 54.8691 45.4376 58.8163 50.3067 58.8163Z"
                    fill="#61DAFB"
                  />
                  <path
                    d="M50.3066 68.0626C76.4333 68.0626 97.6132 59.9757 97.6132 50C97.6132 40.0244 76.4333 31.9375 50.3066 31.9375C24.1799 31.9375 3 40.0244 3 50C3 59.9757 24.1799 68.0626 50.3066 68.0626Z"
                    stroke="#61DAFB"
                    strokeWidth="5"
                  />
                </svg>
                {/* Tailwind */}
                <svg
                  className="w-7 h-7 sm:w-8 sm:h-8"
                  viewBox="0 0 100 100"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M50 20C36.6665 20 28.3334 26.665 24.9996 39.9937C30.0002 33.3287 35.8337 30.8303 42.4999 32.4959C46.3039 33.4463 49.0224 36.206 52.0323 39.2597C56.9341 44.234 62.6075 49.9912 75.0009 49.9912C88.3334 49.9912 96.6677 43.3262 100 29.9962C95.0009 36.6612 89.1674 39.1609 82.4999 37.4953C78.6973 36.5449 75.9787 33.7851 72.9689 30.7315C68.067 25.7571 62.3924 20 50 20Z"
                    fill="#06B6D4"
                  />
                </svg>
                {/* mongodb */}{" "}
                <svg
                  className="w-8 h-8"
                  viewBox="0 0 45 100"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {" "}
                  <path
                    d="M22.1455 0.272949L24.8141 5.28508C25.414 6.21001 26.064 7.0287 26.8295 7.79114C29.074 10.0076 31.1661 12.3732 33.0916 14.8719C37.6131 20.8089 40.6629 27.4022 42.8409 34.5329C44.1471 38.8888 44.8564 43.3572 44.9095 47.8756C45.1282 61.384 40.4973 72.9831 31.1605 82.6231C29.6417 84.1517 28.001 85.5542 26.2546 86.8165C25.3296 86.8165 24.8922 86.1072 24.511 85.4541C23.8167 84.2431 23.3547 82.9131 23.1486 81.5325C22.8205 79.8983 22.6048 78.264 22.7111 76.5766V75.8142C22.6361 75.6517 21.8205 0.657296 22.1455 0.272949Z"
                    fill="#599636"
                  />{" "}
                  <path
                    d="M22.1455 0.107501C22.0361 -0.111232 21.9268 0.0543804 21.8174 0.160623C21.8705 1.25429 21.4893 2.22922 20.8925 3.1604C20.2363 4.08533 19.3676 4.79466 18.4958 5.5571C13.6524 9.75054 9.84015 14.8158 6.78725 20.481C2.72504 28.1054 0.631444 36.2767 0.037737 44.8792C-0.234118 47.9821 1.01892 58.9313 1.99697 62.0904C4.66553 70.4773 9.45893 77.5049 15.6679 83.6045C17.1927 85.0731 18.8239 86.4355 20.5113 87.7448C21.0018 87.7448 21.055 87.3073 21.1675 86.9823C21.3825 86.287 21.5465 85.5768 21.658 84.8575L22.7517 76.6893L22.1455 0.107501Z"
                    fill="#6CAC48"
                  />{" "}
                  <path
                    d="M24.814 90.1352C24.9234 88.8853 25.5234 87.8479 26.1765 86.8136C25.5203 86.5417 25.0328 86.0012 24.6516 85.3981C24.3228 84.8271 24.0507 84.2253 23.8391 83.6013C23.0767 81.314 22.9142 78.9142 22.6955 76.5769V75.1614C22.4236 75.3801 22.3673 77.23 22.3673 77.5049C22.2083 79.9753 21.8805 82.4319 21.3862 84.8575C21.2237 85.8387 21.1143 86.8167 20.5112 87.6885C20.5112 87.7979 20.5112 87.9072 20.5644 88.0697C21.5455 90.957 21.8143 93.8974 21.9799 96.894V97.9877C21.9799 99.2938 21.9268 99.0189 23.0111 99.4563C23.4485 99.6188 23.936 99.6751 24.3735 100C24.7016 100 24.7547 99.7282 24.7547 99.5095L24.5922 97.7127V92.7006C24.5391 91.8257 24.7016 90.957 24.8109 90.1383L24.814 90.1352Z"
                    fill="#C2BFBF"
                  />{" "}
                </svg>{" "}
                {/* Next.js */}{" "}
                <svg
                  className="w-8 h-8 dark:invert"
                  viewBox="0 0 100 100"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {" "}
                  <path
                    d="M50 99.999C77.6142 99.999 100 77.6133 100 49.999C100 22.3848 77.6142 -0.000976562 50 -0.000976562C22.3858 -0.000976562 0 22.3848 0 49.999C0 77.6133 22.3858 99.999 50 99.999Z"
                    fill="black"
                  />{" "}
                  <path
                    d="M83.06 87.5104L38.4122 29.999H30V69.9824H36.7298V38.5454L77.7773 91.5797C79.6294 90.3399 81.394 88.9798 83.06 87.5104Z"
                    fill="url(#paint0_linear_790_2962)"
                  />{" "}
                  <path
                    d="M70.5558 29.999H63.8892V69.999H70.5558V29.999Z"
                    fill="url(#paint1_linear_790_2962)"
                  />{" "}
                  <defs>
                    {" "}
                    <linearGradient
                      id="paint0_linear_790_2962"
                      x1="60.5555"
                      y1="64.7213"
                      x2="80.2778"
                      y2="89.1656"
                      gradientUnits="userSpaceOnUse"
                    >
                      {" "}
                      <stop stopColor="white" />{" "}
                      <stop offset="1" stopColor="white" stopOpacity="0" />{" "}
                    </linearGradient>{" "}
                    <linearGradient
                      id="paint1_linear_790_2962"
                      x1="67.2225"
                      y1="29.999"
                      x2="67.1109"
                      y2="59.3741"
                      gradientUnits="userSpaceOnUse"
                    >
                      {" "}
                      <stop stopColor="white" />{" "}
                      <stop offset="1" stopColor="white" stopOpacity="0" />{" "}
                    </linearGradient>{" "}
                  </defs>{" "}
                </svg>{" "}
                {/* shad cn */}{" "}
                <svg
                  className="w-8 h-8 dark:invert"
                  viewBox="0 0 100 100"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {" "}
                  <g clipPath="url(#clip0_790_3388)">
                    {" "}
                    <path
                      d="M81.25 49.999L50 81.249"
                      stroke="black"
                      strokeWidth="6.25"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />{" "}
                    <path
                      d="M75 15.624L15.625 74.999"
                      stroke="black"
                      strokeWidth="6.25"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />{" "}
                  </g>{" "}
                  <defs>
                    {" "}
                    <clipPath id="clip0_790_3388">
                      {" "}
                      <rect
                        width="100"
                        height="100"
                        fill="white"
                        transform="translate(0 -0.000976562)"
                      />{" "}
                    </clipPath>{" "}
                  </defs>{" "}
                </svg>
              </div>
            </Reveal>
          </div>

          {/* Right Image */}
          <Reveal delay={0.2} className="flex-shrink-0 mt-10 lg:mt-0 self-center">
            <div className="w-[220px] sm:w-[280px] md:w-[320px] lg:w-[350px] aspect-square rounded-full overflow-hidden mx-auto lg:mx-0 shadow-lg">
              <Image
                src="/images/profile.jpg"
                alt="Rayan Khan"
                width={350}
                height={350}
                className="w-full h-full object-cover object-center"
                priority
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
