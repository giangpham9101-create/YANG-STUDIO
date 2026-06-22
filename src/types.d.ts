declare module "*.png";
declare module "*.jpg";
declare module "*.jpeg";
declare module "*.webp";
declare module "*.svg";
declare module "*.gif";
declare module "*.glb";
declare module "*.glb?url" {
  const src: string;
  export default src;
}
