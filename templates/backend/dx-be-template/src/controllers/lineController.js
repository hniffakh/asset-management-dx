import { getAllLinesService, getLineByCodeService, createLineService, updateLineService, deleteLineService} from "../services/lineService.js";
import { HTTP_STATUS } from "../constants/httpStatusCodes.js";

// GET ALL LINES
export const getAllLines = async (req, res, next) => {
  try {
    const result = await getAllLinesService();

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Line data retrieved successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// GET LINE BY CODE
export const getLineByCode = async (req, res, next) => {
  try {
    const { line_code } = req.params;

    const result = await getLineByCodeService(line_code);

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Line detail retrieved successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// CREATE LINE
export const createLine = async (req, res, next) => {
  try {
    const {
      line_code,
      company_code,
      plant_code,
      bu_code,
      product_code,
      area_code,
      line_name,
      line_category,
      flag,
    } = req.validated;

    const result = await createLineService({
      lineCode: line_code,
      companyCode: company_code,
      plantCode: plant_code,
      buCode: bu_code,
      productCode: product_code,
      areaCode: area_code,
      lineName: line_name,
      lineCategory: line_category,
      flag,
      username: req.user.username,
    });

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Line created successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE LINE
export const updateLine = async (req, res, next) => {
  try {
    const { line_code } = req.params;

    const {
      new_line_code,
      company_code,
      plant_code,
      bu_code,
      product_code,
      area_code,
      line_name,
      line_category,
      flag,
    } = req.validated;

    const result = await updateLineService({
      oldLineCode: line_code,
      newLineCode: new_line_code,
      companyCode: company_code,
      plantCode: plant_code,
      buCode: bu_code,
      productCode: product_code,
      areaCode: area_code,
      lineName: line_name,
      lineCategory: line_category,
      flag,
      username: req.user.username,
    });

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Line updated successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE LINE (HARD DELETE)
export const deleteLine = async (req, res, next) => {
  try {
    const { line_code } = req.params;

    const result = await deleteLineService({
      lineCode: line_code,
    });

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Line deleted successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
