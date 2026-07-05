import os
import subprocess

import gifos

FFMPEG = os.environ.get("FFMPEG", "ffmpeg")  # override with $FFMPEG or ensure ffmpeg is on PATH

# ---- ASCII cat silhouette (from ascii-art(1).txt) ----
ART_RAW = """
                        =                                -
                  %@@@@                                   @@@@#
              =@@@@@@@               @     *               @@@@@@@
            @@@@@@@@@@               @#   @@              #@@@@@@@@@@
          @@@@@@@@@@@@@@+           *@@@@@@@            -@@@@@@@@@@@@@@
        @@@@@@@@@@@@@@@@@@@@@@%-    @@@@@@@@@     .%@@@@@@@@@@@@@@@@@@@@@
       @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
      @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
     @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
                   #@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
                     @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*
                      @*       %@@@@@@@@@@@@@@@@=        #@
                                  :@@@@@@@@@@:
                                     @@@@@@.
                                      -@@@
                                        +
"""


def trim(raw):
    lines = [ln.rstrip() for ln in raw.split("\n")]
    while lines and not lines[0].strip():
        lines.pop(0)
    while lines and not lines[-1].strip():
        lines.pop()
    indents = [len(ln) - len(ln.lstrip(" ")) for ln in lines if ln.strip()]
    left = min(indents) if indents else 0
    lines = [ln[left:] for ln in lines]
    width = max((len(ln) for ln in lines), default=0)
    return lines, width


def colorize(art_lines):
    """Render every non-space glyph as a crisp white silhouette; spaces stay transparent."""
    out = []
    for line in art_lines:
        s, i = "", 0
        while i < len(line):
            ch = line[i]
            j = i
            while j < len(line) and line[j] == ch:
                j += 1
            run = line[i:j]
            if ch == " ":
                s += " " * len(run)
            else:
                s += "\x1b[97m" + run
            i = j
        out.append(s + "\x1b[0m")
    return "\n".join(out)


ART_LINES, ART_W = trim(ART_RAW)
CAT = colorize(ART_LINES)
CAT_COL = 2
STATS_COL = CAT_COL + ART_W + 4

STATS = (
    "\x1b[30;101m daksh@GitHub \x1b[0m\n"
    "-------------------------------\n"
    "\x1b[96mFocus:  \x1b[93mAlways Learning\x1b[0m\n"
    "\x1b[96mEdu:    \x1b[93mMech Engineering @ IIT Kanpur\x1b[0m\n"
    "\x1b[96mRoles:  \x1b[93mSWE - CP - ML Builder\x1b[0m\n"
    "\x1b[96mCF:     \x1b[93mExpert - Max 1608\x1b[0m\n"
    "\x1b[96mLang:   \x1b[93mC++ - Python - JavaScript\x1b[0m\n"
    "\x1b[96mWeb:    \x1b[93mReact - Next.js - Node - Postgres\x1b[0m\n"
    "\x1b[96mML/CV:  \x1b[93mTensorFlow - OpenCV - LightGBM\x1b[0m\n"
    "\x1b[96mShips:  \x1b[93mVelodrome - Delhi AQI - Linkage\x1b[0m\n"
    "\n"
    "\x1b[30;101m Contact \x1b[0m\n"
    "-------------------------------\n"
    "\x1b[96mGitHub:   \x1b[93m@DakshSaijwal\x1b[0m\n"
    "\x1b[96mLinkedIn: \x1b[93min/daksh-saijwal\x1b[0m\n"
    "\x1b[96mEmail:    \x1b[93mdakshsaijwal06@gmail.com\x1b[0m"
)


def main():
    t = gifos.Terminal(1160, 560, 18, 16)
    t.set_prompt("\x1b[0;91mdaksh\x1b[0m@\x1b[0;93mgifos ~> \x1b[0m")
    print("ROWS", t.num_rows, "COLS", t.num_cols, "ART_W", ART_W, "STATS_COL", STATS_COL)

    # --- BIOS / boot ---
    t.gen_text("", 1, count=8)
    t.toggle_show_cursor(False)
    t.gen_text("GIF_OS Modular BIOS v2.6  -  \x1b[31mSaijwal Systems\x1b[0m", 1)
    t.gen_text("\x1b[94mGitHub Profile ReadMe Terminal, Rev 1608\x1b[0m", 3)
    t.gen_text("Krypton(tm) GIFCPU @ 250Hz", 5)
    for i in range(0, 65536, 8192):
        t.delete_row(7)
        t.gen_text(f"Memory Test: {i}", 7, count=1, contin=True)
    t.delete_row(7)
    t.gen_text("Memory Test: 64KB \x1b[92mOK\x1b[0m", 7, count=8, contin=True)

    # --- boot sequence ---
    t.clear_frame()
    t.gen_text("Initiating Boot Sequence ", 1, contin=True)
    t.gen_typing_text(".....", 1, contin=True)
    t.gen_text("", 3, count=6)

    t.clear_frame()
    t.clone_frame(4)
    t.gen_text("\x1b[93mGIF OS v1.6 (tty1)\x1b[0m", 1, count=4)
    t.gen_text("login: ", 3, count=3)
    t.toggle_show_cursor(True)
    t.gen_typing_text("daksh", 3, contin=True)
    t.toggle_show_cursor(False)
    t.gen_text("password: ", 4, count=3)
    t.toggle_show_cursor(True)
    t.gen_typing_text("********", 4, contin=True)
    t.toggle_show_cursor(False)
    t.gen_text("Welcome back, Daksh.", 6, count=4)

    # --- run neofetch ---
    t.gen_prompt(7, count=4)
    prompt_col = t.curr_col
    t.toggle_show_cursor(True)
    t.gen_typing_text("\x1b[91mneofet", 7, contin=True)
    t.delete_row(7, prompt_col)
    t.gen_text("\x1b[92mneofetch\x1b[0m", 7, count=3, contin=True)

    # --- neofetch output: cat + stats ---
    t.clear_frame()
    t.toggle_show_cursor(False)
    t.gen_text(CAT, 2, CAT_COL)
    t.gen_text(STATS, 3, STATS_COL, count=6, contin=True)
    t.clone_frame(8)

    t.gen_prompt(25)
    t.toggle_show_cursor(True)
    t.gen_typing_text("\x1b[92m# thanks for stopping by :)", 25, contin=True)
    t.gen_text("", 25, count=90, contin=True)

    # --- assemble gif (Windows-safe ffmpeg call) ---
    subprocess.run(
        [
            FFMPEG, "-y", "-hide_banner", "-loglevel", "error", "-r", "15",
            "-i", "frames/frame_%d.png",
            "-filter_complex",
            "[0:v] split [a][b];[a] palettegen [p];[b][p] paletteuse",
            "output.gif",
        ],
        check=True,
    )
    size = os.path.getsize("output.gif")
    print(f"DONE output.gif  {size} bytes")


if __name__ == "__main__":
    main()
