function mneCall(date, callback) {
  const param = {
    Kind: 9,
  };
  get("/sub_03_00M.aspx", param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;
    const attr = "href";
    const els = ifr.gba(attr, "sub_03_01M.aspx?", true);
    els.forEach((el) => {
      const { Kind, YMD } = el.attr(attr).gup();
      dates.push([YMD, Kind]);
    });

    param.Kind = 6;
    get("/sub_03_00M.aspx", param, {}, (data) => {
      const ifr = doc.clm("div");
      ifr.innerHTML = data;
      const attr = "href";
      const els = ifr.gba(attr, "sub_03_01M.aspx?", true);
      els.forEach((el) => {
        const { Kind, YMD } = el.attr(attr).gup();
        dates.push([YMD, Kind]);
      });
      callback();
    });
  });
}
