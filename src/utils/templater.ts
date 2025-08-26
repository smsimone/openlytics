import * as fs from "fs";

export function loadTemplate(
  path: string,
  params: { [key: string]: string | number | null | undefined },
  root: string = ".",
): string {
  let content = fs.readFileSync(path, "utf-8");

  Object.keys(params).forEach((key) => {
    const placeholder = `{{${key}}}`;
    if (params[key])
      content = content.replace(placeholder, params[key].toString());
  });

  return content;
}
