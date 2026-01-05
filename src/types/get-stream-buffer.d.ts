declare module "get-stream/buffer" {
  import { Readable } from "stream";
  /**
   * Read a Node.js Readable stream into a Buffer.
   * @param stream - The readable stream to collect.
   * @param options.maxBuffer - Maximum number of bytes to buffer before throwing an error.
   */
  export default function buffer(
    stream: Readable,
    options?: { maxBuffer?: number }
  ): Promise<Buffer>;
}