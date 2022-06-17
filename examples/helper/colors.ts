

export function rgb(r:number,g:number,b:number, a?: number) {
  if(typeof(a) === "undefined")
    return `rgb(${r}, ${g}, ${b})`;
  else
    return `rgba(${r}, ${g}, ${b}, ${a})`;
}