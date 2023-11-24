export const formatDate = (f : string) => {
    return f.split("T",1)[0].replace(/\\/g, "").substring(1, f.length);
  }