import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

void main() {
  runApp(const AarogyaOSCitizenApp());
}

class AarogyaOSCitizenApp extends StatelessWidget {
  const AarogyaOSCitizenApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'AarogyaOS Citizen',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF0F766E), // Teal primary matching AarogyaOS design system
          primary: const Color(0xFF0F766E),
          secondary: const Color(0xFF0D9488),
        ),
        textTheme: GoogleFonts.interTextTheme(),
        useMaterial3: true,
      ),
      home: const CitizenHomeScreen(),
    );
  }
}

class CitizenHomeScreen extends StatefulWidget {
  const CitizenHomeScreen({super.key});

  @override
  State<CitizenHomeScreen> createState() => _CitizenHomeScreenState();
}

class _CitizenHomeScreenState extends State<CitizenHomeScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('AarogyaOS Citizen Portal', style: TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: Theme.of(context).colorScheme.primary,
        foregroundColor: Colors.white,
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header Card
              Card(
                color: const Color(0xFFF0FDFA),
                elevation: 0,
                shape: RoundedRectangleBorder(
                  side: const BorderSide(color: Color(0xFFCCFBF1)),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'AI Health Assistance',
                        style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFF115E59)),
                      ),
                      const SizedBox(height: 8),
                      const Text(
                        'Check symptoms using Gemini Multimodal AI or find local healthcare resources.',
                        style: TextStyle(color: Color(0xFF134E4A)),
                      ),
                      const SizedBox(height: 12),
                      ElevatedButton.icon(
                        onPressed: () {},
                        icon: const Icon(Icons.medical_services),
                        label: const Text('Start Symptom Check'),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF0F766E),
                          foregroundColor: Colors.white,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 24),
              const Text(
                'Services',
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 12),
              GridView.count(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                crossAxisCount: 2,
                crossAxisSpacing: 12,
                mainAxisSpacing: 12,
                children: [
                  _buildServiceCard(Icons.map, 'Find PHC', 'Navigate to nearest clinic'),
                  _buildServiceCard(Icons.notifications, 'Alerts Feed', 'View local outbreak alarms'),
                  _buildServiceCard(Icons.qr_code_scanner, 'Check-In', 'Scan check-in validation code'),
                  _buildServiceCard(Icons.info, 'Guidelines', 'WHO/MoHFW official guides'),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildServiceCard(IconData icon, String title, String subtitle) {
    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: InkWell(
        onTap: () {},
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Icon(icon, size: 32, color: const Color(0xFF0F766E)),
              const SizedBox(height: 12),
              Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
              const SizedBox(height: 4),
              Text(subtitle, style: const TextStyle(fontSize: 10, color: Colors.grey), maxLines: 2),
            ],
          ),
        ),
      ),
    );
  }
}
