import 'dart:convert';
import 'package:http/http.dart' as http;

class ApiService {
  static const String baseUrl = 'https://aarogyaos-1002038102139.asia-south1.run.app/api/v1';

  // Submit symptom analysis payload to our deployed Gemini endpoint on Cloud Run
  Future<Map<String, dynamic>> checkSymptoms(String base64Image, Map<String, dynamic> patientInfo) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/triage'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'base64Image': base64Image,
          'patientInfo': patientInfo,
        }),
      );

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        throw Exception('Server error: ${response.statusCode}');
      }
    } catch (e) {
      return {
        'severity': 'MODERATE',
        'condition': 'Failed to connect to AI triage gateway.',
        'action': 'Please verify connection and retry.',
        'confidence': 0
      };
    }
  }
}
