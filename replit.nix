{pkgs}: {
  deps = [
    pkgs.imagemagick
    pkgs.ffmpeg
    pkgs.sox
    pkgs.jq
    pkgs.postgresql
  ];
}
