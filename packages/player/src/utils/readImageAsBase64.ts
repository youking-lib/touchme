export function readImageAsBase64(
  file: File
): Promise<{ alt: string; src: string }> {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.addEventListener(
      "load",
      () => {
        resolve({
          alt: file.name,
          src: reader.result as string,
        });
      },
      false
    );
    reader.readAsDataURL(file);
  });
}
