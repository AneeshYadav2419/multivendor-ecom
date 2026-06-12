import { Request, Response }
    from "express";

import { couponService }
    from "./coupon.service.js";

export const createCoupon = async (
    req: Request,
    res: Response
) => {
    const coupon =
        await couponService.createCoupon(
            req.body
        );

    return res.status(201).json({
        success: true,
        data: coupon,
    });
};

export const getCoupons = async (
    req: Request,
    res: Response
) => {
    const coupons =
        await couponService.getCoupons();
    console.log(coupons);

    return res.status(200).json({
        success: true,
        data: coupons,
    });


};
// export const updateCoupon = async (
//     req: Request,
//     res: Response
// ) => {
//     const coupon =
//         await couponService.updateCoupon(
//             req.params.id as string,
//             req.body
//         );

//     res.status(200).json({
//         success: true,
//         data: coupon,
//     });
// };
export const updateCoupon = async (
    req: Request,
    res: Response
) => {

    console.log(
        "REQ BODY",
        req.body
    );

    const coupon =
        await couponService.updateCoupon(
            req.params.id as string,
            req.body
        );

    res.status(200).json({
        success: true,
        data: coupon,
    });
};