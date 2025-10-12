package com.cot.fem;

/**
 * EnrichType：XFEM 富集类型标记
 * NONE        - 普通节点，无富集
 * HEAVISIDE   - 裂纹两侧的跳跃富集
 * CRACK_TIP   - 裂尖奇异场富集
 */
public enum EnrichType {
    NONE,
    HEAVISIDE,
    CRACK_TIP
}
