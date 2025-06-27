export async function encrypt({
  exportCanvasContext,
  sourceImage,
}: {
  exportCanvasContext: CanvasRenderingContext2D;
  sourceImage: CanvasImageSource;
  sourceImageInfo: { height: number; width: number };
}): Promise<void> {
  exportCanvasContext.drawImage(sourceImage, 0, 0);
}