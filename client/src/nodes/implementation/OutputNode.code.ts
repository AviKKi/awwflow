export default function func(data: {
    outputValue: string;
    outputName: string;
  }) {
    return data.outputName?{[data.outputName]:data.outputValue}:data.outputValue;
  }
  