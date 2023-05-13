/**
 * @module preload
 */
import { createEndpointForReceiver } from "./extensionBridge";

// @ts-ignore
window.createEndpointForReceiver = createEndpointForReceiver;