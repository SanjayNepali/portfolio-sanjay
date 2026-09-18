/**
 * Wraps each character of an element's text in its own inline-block span so
 * characters can be staggered individually.
 *
 * Spaces are emitted as REAL text nodes, not spans and not `\u00A0`. A
 * non-breaking space removes the only legal line break opportunity in the
 * string, which is why "Web developer" used to break mid-word on narrow
 * screens instead of wrapping at the space.
 */
export function splitChars(el: HTMLElement): HTMLSpanElement[] {
  const text = el.textContent ?? "";
  const spans: HTMLSpanElement[] = [];
  const fragment = document.createDocumentFragment();

  for (const char of text) {
    if (char === " ") {
      fragment.appendChild(document.createTextNode(" "));
      continue;
    }

    const span = document.createElement("span");
    span.textContent = char;
    span.style.display = "inline-block";
    fragment.appendChild(span);
    spans.push(span);
  }

  el.textContent = "";
  el.appendChild(fragment);

  return spans;
}
