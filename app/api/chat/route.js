import { NextResponse } from "next/server";

const PRESET_SEATING = [
  2, 5, 28,
  13, 7, 22, 6, 25,
  19, 14, 29, 20, 27, 15,
  3, 4, 8, 17, 18, 1,
  10, 12, 23, 16, 24, 21
];

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export async function POST(req) {
  try {
    const { totalStudents, isRigged } = await req.json();

    let assignedSeats = [];

    if (isRigged) {
      const validPreset = PRESET_SEATING.filter((studentNum) =>
        totalStudents.includes(studentNum)
      );
      const missingStudents = totalStudents.filter(
        (studentNum) => !PRESET_SEATING.includes(studentNum)
      );
      assignedSeats = [...validPreset, ...missingStudents];
    } else {
      assignedSeats = shuffle(totalStudents);
    }

    return NextResponse.json({
      success: true,
      mode: isRigged ? "rigged" : "random",
      assignments: assignedSeats,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "배치 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
